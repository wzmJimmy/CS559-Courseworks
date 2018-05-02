var shader = {};

shader["Proj"] = twgl.createProgramInfo(gl, ["vs_proj", "fs_proj"]);
shader["Bump"] = twgl.createProgramInfo(gl, ["vs_bump+proj", "fs_bump+proj"]);
shader["Cube"] = twgl.createProgramInfo(gl, ["vs_ball", "fs_ball"]);
shader["Text"] = twgl.createProgramInfo(gl, ["vs_text+proj", "fs_text+proj"]);
shader["Sky"] = twgl.createProgramInfo(gl, ["vsky", "fsky"]);