var shader = {};
shader["Myobj"] = twgl.createProgramInfo(gl, ["vs", "fs"]);
shader["Proj"] = twgl.createProgramInfo(gl, ["vs_proj", "fs_proj"]);
shader["Text"] = twgl.createProgramInfo(gl, ["vst", "fst"]);
shader["Bump"] = twgl.createProgramInfo(gl, ["vs_bump", "fs_bump"]);
shader["Cube"] = twgl.createProgramInfo(gl, ["vs_ball", "fs_ball"]);
shader["Sky"] = twgl.createProgramInfo(gl, ["vsky", "fsky"]);