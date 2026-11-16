import bpy, json, math, os, random, sys
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1:]
MANIFEST, OUTROOT = args[0], args[1]
cfg = json.load(open(MANIFEST, encoding="utf-8"))
FPS = int(cfg.get("fps", 30))
random.seed(7)

AMBER = (1.0, 0.55, 0.09)
TEAL = (0.18, 0.80, 0.72)
GREY = (0.22, 0.25, 0.30)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def setup():
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = 16
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 2
    sc.cycles.diffuse_bounces = 1
    sc.cycles.glossy_bounces = 1
    sc.cycles.transmission_bounces = 1
    sc.render.resolution_x = 720
    sc.render.resolution_y = 1280
    sc.render.resolution_percentage = 100
    sc.render.fps = FPS
    sc.render.image_settings.file_format = "PNG"
    sc.render.film_transparent = False
    try:
        sc.cycles.denoiser = "OPENIMAGEDENOISE"
    except Exception:
        pass
    w = bpy.data.worlds.new("W")
    sc.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (0.004, 0.006, 0.012, 1)
    bg.inputs[1].default_value = 1.0
    return sc


def mat(name, color, strength=2.2):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (color[0], color[1], color[2], 1)
    b.inputs["Roughness"].default_value = 0.55
    for key in ("Emission Color", "Emission"):
        if key in b.inputs:
            try:
                b.inputs[key].default_value = (color[0], color[1], color[2], 1)
            except Exception:
                pass
            break
    if "Emission Strength" in b.inputs:
        b.inputs["Emission Strength"].default_value = strength
    return m


def cam(loc, look=(0, 0, 0), lens=52):
    cd = bpy.data.cameras.new("C")
    cd.lens = lens
    c = bpy.data.objects.new("C", cd)
    bpy.context.collection.objects.link(c)
    c.location = loc
    tgt = bpy.data.objects.new("T", None)
    bpy.context.collection.objects.link(tgt)
    tgt.location = look
    con = c.constraints.new("TRACK_TO")
    con.target = tgt
    con.track_axis = "TRACK_NEGATIVE_Z"
    con.up_axis = "UP_Y"
    bpy.context.scene.camera = c
    return c


def ico(loc, r, m, subdiv=1):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdiv, radius=r, location=loc)
    o = bpy.context.active_object
    o.data.materials.append(m)
    return o


def cluster(m, n=130, radius=0.85, jitter=0.18):
    objs = []
    for i in range(n):
        u = random.uniform(0, 1)
        th = random.uniform(0, math.tau)
        ph = math.acos(2 * u - 1)
        r = radius * (1 + random.uniform(-jitter, jitter))
        p = (r * math.sin(ph) * math.cos(th), r * math.sin(ph) * math.sin(th) * 0.78, r * math.cos(ph) * 1.15)
        objs.append((ico(p, random.uniform(0.035, 0.075), m), p))
    return objs


def render(sc, outdir, frames):
    os.makedirs(outdir, exist_ok=True)
    sc.frame_start = 1
    sc.frame_end = frames
    sc.render.filepath = os.path.join(outdir, "")
    bpy.ops.render.render(animation=True)


def shot_hook(frames, outdir):
    reset()
    sc = setup()
    m = mat("amber", AMBER)
    cluster(m)
    c = cam((0, -3.4, 0.35))
    for f in (1, frames):
        a = math.radians(-7 + 14 * (f - 1) / max(1, frames - 1))
        c.location = (3.4 * math.sin(a), -3.4 * math.cos(a), 0.35)
        c.keyframe_insert("location", frame=f)
    render(sc, outdir, frames)


def shot_upload(frames, outdir):
    reset()
    sc = setup()
    m = mat("teal", TEAL)
    objs = cluster(m, n=120)
    side = 5
    for idx, (o, base) in enumerate(objs):
        gx, gy, gz = idx % side, (idx // side) % side, (idx // (side * side)) % side
        target = ((gx - 2) * 0.28, (gy - 2) * 0.28, (gz - 2) * 0.28)
        o.keyframe_insert("location", frame=1)
        o.location = target
        o.keyframe_insert("location", frame=int(frames * 0.55) + (idx % 22))
    c = cam((0, -3.6, 0.2))
    c.keyframe_insert("location", frame=1)
    c.location = (0, -2.7, 0.2)
    c.keyframe_insert("location", frame=frames)
    render(sc, outdir, frames)


def shot_scale(frames, outdir):
    reset()
    sc = setup()
    m = mat("amber", AMBER, 1.6)
    n = 620
    for i in range(n):
        r = 0.9 * random.uniform(0, 1) ** (1 / 3)
        th = random.uniform(0, math.tau)
        ph = math.acos(2 * random.uniform(0, 1) - 1)
        ico((r * math.sin(ph) * math.cos(th), r * math.sin(ph) * math.sin(th), r * math.cos(ph)),
            random.uniform(0.008, 0.02), m, subdiv=1)
    c = cam((0, -2.4, 0.15))
    c.keyframe_insert("location", frame=1)
    c.location = (0, -6.2, 0.15)
    c.keyframe_insert("location", frame=frames)
    render(sc, outdir, frames)


def humanoid(m, x=0.0, hollow=False):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=10, radius=0.13, location=(x, 0, 0.92))
    head = bpy.context.active_object
    head.data.materials.append(m)
    for (loc, rot, length) in [((x, 0, 0.62), (0, 0, 0), 0.42), ((x - 0.14, 0, 0.60), (0, math.radians(12), 0), 0.36),
                               ((x + 0.14, 0, 0.60), (0, math.radians(-12), 0), 0.36),
                               ((x - 0.07, 0, 0.16), (0, 0, 0), 0.44), ((x + 0.07, 0, 0.16), (0, 0, 0), 0.44)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.045, depth=length, location=loc, rotation=rot)
        cyl = bpy.context.active_object
        cyl.data.materials.append(m)


def shot_body(frames, outdir):
    reset()
    sc = setup()
    humanoid(mat("grey", GREY, 0.6), x=-0.42)
    humanoid(mat("teal", TEAL, 2.0), x=0.42)
    c = cam((0, -2.6, 0.55), look=(0, 0, 0.55))
    for f in (1, frames):
        a = math.radians(-32 + 64 * (f - 1) / max(1, frames - 1))
        c.location = (2.6 * math.sin(a), -2.6 * math.cos(a), 0.55)
        c.keyframe_insert("location", frame=f)
    render(sc, outdir, frames)


def shot_copy(frames, outdir):
    reset()
    sc = setup()
    a = mat("amber", AMBER)
    t = mat("teal", TEAL)
    cluster(a)
    moved = cluster(t)
    for o, base in moved:
        o.keyframe_insert("location", frame=1)
        o.location = (base[0] + 1.35, base[1], base[2])
        o.keyframe_insert("location", frame=int(frames * 0.7))
    c = cam((0, -4.0, 0.3), look=(0.45, 0, 0.3))
    c.keyframe_insert("location", frame=1)
    c.location = (0, -3.4, 0.3)
    c.keyframe_insert("location", frame=frames)
    render(sc, outdir, frames)


SHOTS = {"01-hook": shot_hook, "02-upload": shot_upload, "03-scale": shot_scale,
         "04-body": shot_body, "05-copy": shot_copy}

for s in cfg["scenes"]:
    sid, frames = s["id"], int(s["frames"])
    fn = SHOTS.get(sid)
    if not fn:
        print("skip", sid)
        continue
    print(f"=== {sid} {frames} frames", flush=True)
    fn(frames, os.path.join(OUTROOT, sid))
    print(f"=== done {sid}", flush=True)
print("ALL DONE")
