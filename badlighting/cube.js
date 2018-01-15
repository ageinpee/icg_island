// Environment variables
let gl,
	canvas;

// Scene variables
let objects = [];

//Global Camera variables for use in movement calculations
let eye = vec3.fromValues(1.0, -0.6, 1.0);

let look = vec3.fromValues(0.0, 0.0, -1.0);

let up = vec3.fromValues(0.0, 1.0, 0.0);

let target = vec3.create();

// Shader variables
let program;

let pointLoc,
	normalLoc,
	ambientRLoc,
	diffuseRLoc,
	specularRLoc;

let modelMatrixLoc;

let viewMatrixLoc,
	viewMatrix;

let projectionMatrixLoc,
	projectionMatrix;
	
//Vertice positions of the Island in Script Island_Beta2.js
//Vertice positions of the Ocean in Script Grid_Beta.js

function degToRad (deg) {
	return deg * Math.PI / 180;
}

class Island {
	constructor () {
		this.mesh = [];
		this.normals = [];
		this.ambientR = [];
		this.diffuseR = [];
		this.orientation = {x: 0, y: 0, z: 0};
		this.position = {x: 0, y: -1, z: 0};
		this.verticesVBO = gl.createBuffer();
		this.colorVBO = gl.createBuffer();
		this.modelMatrix = this.SetModelMatrix(this.position, this.orientation);
		
		this.MakeModel();
		this.InitBuffer();
	}

	/**
	 * Makes the model, namely the mesh and the normals arrays
	 */
	MakeModel () {
		//adding the Islands-Positions to the Mesh. 
		this.mesh = this.mesh.concat(island);
		
		for (var i = 0; i < island_normals.length; i+=3){
			this.normals = this.normals.concat(island_normals[i]);
			this.normals = this.normals.concat(island_normals[i+1]);
			this.normals = this.normals.concat(island_normals[i+2]);
			this.normals = this.normals.concat(island_normals[i]);
			this.normals = this.normals.concat(island_normals[i+1]);
			this.normals = this.normals.concat(island_normals[i+2]);
			this.normals = this.normals.concat(island_normals[i]);
			this.normals = this.normals.concat(island_normals[i+1]);
			this.normals = this.normals.concat(island_normals[i+2]);
		}
		
		for (var i=0; i<this.mesh.length/3; i++)
		{
			this.ambientR = this.ambientR.concat([0.9,0.6,0.2,1.0]);
			this.diffuseR = this.diffuseR.concat([0.47,0.25,0.01,1.0]);
		}
	}
	
	/**
	 * Sets the model matrix
	 * @param {Object} position x,y,z
	 * @param {Object} orientation x,y,z - angles in degree
	 */
	SetModelMatrix (position, orientation) {
		
		// Convert the orientation to RAD
		orientation = {x: degToRad(orientation.x), y: degToRad(orientation.y), z: degToRad(orientation.z)};
	
		// Set the transformation matrix
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			position.x, position.y, position.z, 1
		];
	}

	/**
	 * Sets the buffer data
	 */
	InitBuffer () {
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.concat(this.normals)), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorVBO);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.ambientR.concat(this.diffuseR)), gl.STATIC_DRAW);

	}

	/**
	 * Updates the model matrix to the buffer
	 */
	UpdateBuffer () {
		// Push the matrix to the buffer
		gl.uniformMatrix4fv(modelMatrixLoc, false, new Float32Array(this.modelMatrix));		
	}

	Render () {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorVBO);

		gl.vertexAttribPointer(ambientRLoc, 4, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(diffuseRLoc, 4, gl.FLOAT, false, 0, this.ambientR.length*4);
		gl.enableVertexAttribArray(ambientRLoc);
		gl.enableVertexAttribArray(diffuseRLoc);
		// Bind the program and the vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		// Set attribute pointers and enable them
		gl.vertexAttribPointer(pointLoc, 3, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, this.mesh.length*4);
		gl.enableVertexAttribArray(pointLoc);
		gl.enableVertexAttribArray(normalLoc);



		// Set uniforms
		this.UpdateBuffer();

		// Draw the object
		gl.drawArrays(gl.TRIANGLES, 0, this.mesh.length/3);
	}
}

class Ocean {
	constructor () {
		this.mesh = [];
		this.normals = [];
		this.ambientR = [];
		this.diffuseR = [];
		this.orientation = {x: 0, y: 0, z: 0};
		this.position = {x: 0, y: -0.86, z: 0};
		this.verticesVBO = gl.createBuffer();
		this.colorVBO = gl.createBuffer();
		this.modelMatrix = this.SetModelMatrix(this.position, this.orientation);

		this.MakeModel();
		this.InitBuffer();
	}

	/**
	 * Makes the model, namely the mesh and the normals arrays
	 */
	MakeModel () {
		//adding the Ocean-Positions to the Mesh. 
		this.mesh = this.mesh.concat(ocean);
		
		for (var i = 0; i < ocean_normals.length; i+=3){
			this.normals = this.normals.concat(ocean_normals[i]);
			this.normals = this.normals.concat(ocean_normals[i+1]);
			this.normals = this.normals.concat(ocean_normals[i+2]);
			this.normals = this.normals.concat(ocean_normals[i]);
			this.normals = this.normals.concat(ocean_normals[i+1]);
			this.normals = this.normals.concat(ocean_normals[i+2]);
			this.normals = this.normals.concat(ocean_normals[i]);
			this.normals = this.normals.concat(ocean_normals[i+1]);
			this.normals = this.normals.concat(ocean_normals[i+2]);
		}
		
		for (var i = 0; i < this.mesh.length/3; i++)
		{
			this.ambientR = this.ambientR.concat([0.05,0.3,0.5,1.0]);
			this.diffuseR = this.diffuseR.concat([0.01,0.52,0.53,1.0]);
		}
	}
	
	/**
	 * Sets the model matrix
	 * @param {Object} position x,y,z
	 * @param {Object} orientation x,y,z - angles in degree
	 */
	SetModelMatrix (position, orientation) {
		
		// Convert the orientation to RAD
		orientation = {x: degToRad(orientation.x), y: degToRad(orientation.y), z: degToRad(orientation.z)};
	
		// Set the transformation matrix
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			position.x, position.y, position.z, 1
		];
	}

	/**
	 * Sets the buffer data
	 */
	InitBuffer () {
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.concat(this.normals)), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorVBO);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.ambientR.concat(this.diffuseR)), gl.STATIC_DRAW);
	}

	/**
	 * Updates the model matrix to the buffer
	 */
	UpdateBuffer () {
		// Push the matrix to the buffer
		gl.uniformMatrix4fv(modelMatrixLoc, false, new Float32Array(this.modelMatrix));		
	}

	Render () {

		gl. bindBuffer(gl.ARRAY_BUFFER, this.colorVBO);

		gl.vertexAttribPointer(ambientRLoc, 4, gl.FLOAT, false, 0,0);
		gl.vertexAttribPointer(diffuseRLoc, 4, gl.FLOAT, false, 0, this.ambientR.length*4);
		gl.enableVertexAttribArray(ambientRLoc);
		gl.enableVertexAttribArray(diffuseRLoc);
		// Bind the program and the vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		// Set attribute pointers and enable them
		gl.vertexAttribPointer(pointLoc, 3, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, this.mesh.length*4);
		gl.enableVertexAttribArray(pointLoc);
		gl.enableVertexAttribArray(normalLoc);



		// Set uniforms
		this.UpdateBuffer();

		// Draw the object
		gl.drawArrays(gl.TRIANGLES, 0, this.mesh.length/3);
	}
}

class Palmtree {
	constructor () {
		this.mesh = [];
		this.normals = [];
		this.ambientR = [];
		this.diffuseR = [];
		this.orientation = {x: -90, y: 0, z: 0};
		this.position = {x: 0, y: -0.9, z: 0};
		this.verticesVBO = gl.createBuffer();
		this.colorVBO = gl.createBuffer();
		this.modelMatrix = this.SetModelMatrix(this.position, this.orientation);

		this.MakeModel();
		this.InitBuffer();
	}

	/**
	 * Makes the model, namely the mesh and the normals arrays
	 */
	MakeModel () {
		//adding the palm-trees positions to the mesh 
		this.mesh = this.mesh.concat(palmtree);
		
		for (var i = 0; i < palmtree_normals.length; i+=3){
			this.normals = this.normals.concat(palmtree_normals[i]);
			this.normals = this.normals.concat(palmtree_normals[i+1]);
			this.normals = this.normals.concat(palmtree_normals[i+2]);
			this.normals = this.normals.concat(palmtree_normals[i]);
			this.normals = this.normals.concat(palmtree_normals[i+1]);
			this.normals = this.normals.concat(palmtree_normals[i+2]);
			this.normals = this.normals.concat(palmtree_normals[i]);
			this.normals = this.normals.concat(palmtree_normals[i+1]);
			this.normals = this.normals.concat(palmtree_normals[i+2]);
		}
		
		for (var i = 0; i < this.mesh.length/3; i++)
		{
			this.ambientR = this.ambientR.concat([0.33,0.21,0.1,1.0]);
			this.diffuseR = this.diffuseR.concat([0.46,0.26,0.09,1.0]);
		}
	}
	
	/**
	 * Sets the model matrix
	 * @param {Object} position x,y,z
	 * @param {Object} orientation x,y,z - angles in degree
	 */
	SetModelMatrix (position, orientation) {
		
		// Convert the orientation to RAD
		//orientation = {x: degToRad(orientation.x), y: degToRad(orientation.y), z: degToRad(orientation.z)};
		
		let rotationQuat = quat.create();
		quat.fromEuler(rotationQuat, orientation.x, orientation.y, orientation.z);
		let translationVec = vec3.fromValues(position.x, position.y, position.z);
		let scalingVec = vec3.fromValues(0.3, 0.3, 0.3);
		
		let modelMatrix = mat4.create();
		mat4.fromRotationTranslationScale(modelMatrix, rotationQuat, translationVec, scalingVec);
		
		// Set the transformation matrix
		return modelMatrix;
	}

	/**
	 * Sets the buffer data
	 */
	InitBuffer () {
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.concat(this.normals)), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorVBO);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.ambientR.concat(this.diffuseR)), gl.STATIC_DRAW);
	}

	/**
	 * Updates the model matrix to the buffer
	 */
	UpdateBuffer () {
		// Push the matrix to the buffer
		gl.uniformMatrix4fv(modelMatrixLoc, false, new Float32Array(this.modelMatrix));		
	}

	Render () {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorVBO);

		gl.vertexAttribPointer(ambientRLoc, 4, gl.FLOAT, false, 0,0);
		gl.vertexAttribPointer(diffuseRLoc, 4, gl.FLOAT, false, 0, this.ambientR.length*4);
		gl.enableVertexAttribArray(ambientRLoc);
		gl.enableVertexAttribArray(diffuseRLoc);
		// Bind the program and the vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		// Set attribute pointers and enable them
		gl.vertexAttribPointer(pointLoc, 3, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, this.mesh.length*4);
		gl.enableVertexAttribArray(pointLoc);
		gl.enableVertexAttribArray(normalLoc);


		// Set uniforms
		this.UpdateBuffer();

		// Draw the object
		gl.drawArrays(gl.TRIANGLES, 0, this.mesh.length/3);
	}
}

class Palmleaf {
	constructor (orientation, position) {
		this.mesh = [];
		this.normals = [];
		this.ambientR = [];
		this.diffuseR = [];
		this.orientation = orientation;
		this.position = position;
		this.colorVBO = gl.createBuffer();
		this.verticesVBO = gl.createBuffer();
		this.modelMatrix = this.SetModelMatrix(this.position, this.orientation);

		this.MakeModel();
		this.InitBuffer();
	}

	/**
	 * Makes the model, namely the mesh and the normals arrays
	 */
	MakeModel () {
		//adding the leafs positions to the Mesh. 
		this.mesh = this.mesh.concat(palmleaf);
		
		for (var i = 0; i < palmleaf_normals.length; i+=3){
			this.normals = this.normals.concat(palmleaf_normals[i]);
			this.normals = this.normals.concat(palmleaf_normals[i+1]);
			this.normals = this.normals.concat(palmleaf_normals[i+2]);
			this.normals = this.normals.concat(palmleaf_normals[i]);
			this.normals = this.normals.concat(palmleaf_normals[i+1]);
			this.normals = this.normals.concat(palmleaf_normals[i+2]);
			this.normals = this.normals.concat(palmleaf_normals[i]);
			this.normals = this.normals.concat(palmleaf_normals[i+1]);
			this.normals = this.normals.concat(palmleaf_normals[i+2]);
		}
		
		for(var i = 0; i < this.mesh.length/3; i++)
		{
			this.ambientR = this.ambientR.concat([0.0,0.7,0.0,1.0]);
			this.diffuseR = this.diffuseR.concat([0.37,0.01,0.69,1.0]);
		}
	}
	
	/**
	 * Sets the model matrix
	 * @param {Object} position x,y,z
	 * @param {Object} orientation x,y,z - angles in degree
	 */
	SetModelMatrix (position, orientation) {
		
		// Convert the orientation to RAD
		//orientation = {x: degToRad(orientation.x), y: degToRad(orientation.y), z: degToRad(orientation.z)};
		
		let rotationQuat = quat.create();
		quat.fromEuler(rotationQuat, orientation.x, orientation.y, orientation.z);
		let translationVec = vec3.fromValues(position.x, position.y, position.z);
		let scalingVec = vec3.fromValues(0.07, 0.07, 0.07);
		
		let modelMatrix = mat4.create();
		mat4.fromRotationTranslationScale(modelMatrix, rotationQuat, translationVec, scalingVec);
		
		// Set the transformation matrix
		return modelMatrix;
	}

	/**
	 * Sets the buffer data
	 */
	InitBuffer () {
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.concat(this.normals)), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorVBO);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.ambientR.concat(this.diffuseR)), gl.STATIC_DRAW);
	}

	/**
	 * Updates the model matrix to the buffer
	 */
	UpdateBuffer () {
		// Push the matrix to the buffer
		gl.uniformMatrix4fv(modelMatrixLoc, false, new Float32Array(this.modelMatrix));		
	}

	Render () {
		
		// Bind the program and the vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesVBO);

		// Set attribute pointers and enable them
		gl.vertexAttribPointer(pointLoc, 3, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, this.mesh.length*4);
		gl.enableVertexAttribArray(pointLoc);
		gl.enableVertexAttribArray(normalLoc);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorVBO);

		gl.vertexAttribPointer(ambientRLoc, 4, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(diffuseRLoc, 4,gl.FLOAT,false, 0, this.ambientR.length*4);
		gl.enableVertexAttribArray(ambientRLoc);
		gl.enableVertexAttribArray(diffuseRLoc);

		// Set uniforms
		this.UpdateBuffer();

		// Draw the object
		gl.drawArrays(gl.TRIANGLES, 0, this.mesh.length/3);
	}
}
/**
 * Initializes the program, models and shaders
 */
function init() {

	// 1. Get canvas and setup WebGL context
    canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext('webgl');
	
	// 2. Configure viewport
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(0.95,0.95,0.95,1.0);
	gl.enable(gl.DEPTH_TEST);

	// 3. Specify vertices
	objects.push(new Island());	
	objects.push(new Ocean());
	objects.push(new Palmtree());
	objects.push(new Palmleaf({x: -90, y: 0, z:0},{x: -0.02, y: -0.3, z: -0.09}));

	// 4. Init shader program via additional function and bind it
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	// 7 Save attribute location to address them
	pointLoc = gl.getAttribLocation(program, "vPosition");
	normalLoc = gl.getAttribLocation(program, "vNormal");
	ambientRLoc = gl.getAttribLocation(program, "ambientR");
	diffuseRLoc = gl.getAttribLocation(program, "diffuseR");
	modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");

    // Set view matrix
	//--> defined globally
	vec3.add(target, eye, look);

	viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, target, up);

	// 7 Save uniform location and save the view matrix into it
	viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

    // Set projection matrix

	projectionMatrix = mat4.create();
	mat4.perspective(projectionMatrix, Math.PI * 0.25, canvas.width / canvas.height, 0.005, 100);

	// 7 Save uniform location and save the projection matrix into it
	projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
	gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
	
	// 8. Render
	render();
};

function render()
{
	gl.clear(gl.normal_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Call every render function
    objects.forEach(function(object) {
		object.Render();
	});
	
	// Set view matrix
	vec3.add(target, eye, look);

	viewMatrix = mat4.create();
	mat4.lookAt(viewMatrix, eye, target, up);

	var modelViewInv = mat4.create();
	var normalMatrix = mat4.create();
	//modelViewMatrix statt viewMatrix invertieren?
	mat4.invert(modelViewInv, viewMatrix);
	mat4.transpose(normalMatrix, modelViewInv);

	// 7 Save uniform location and save the view matrix into it
	viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
	gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix);

	normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");
	gl.uniformMatrix4fv(normalMatrixLoc, false, normalMatrix);

	requestAnimationFrame(render);
}


// Get the mouse position over the canvas
function mousemove(event)
{
	var rect = canvas.getBoundingClientRect(); // To get the absolute position
	var mousePosX = event.clientX - rect.left;
	var mousePosY = canvas.height - event.clientY - rect.top;

	var movementX = event.movementX;
	var movementY = event.movementY;

	//Horizontal rotation
	vec3.rotateY(look, look, eye, 0.002 * -movementX);
	//Vertical rotation
	vec3.rotateX(look, look, eye, 0.002 * -movementY);
}

let strafe = vec3.create();
let move;
let speed = 0.02; //movement speed
//move the camera on keypress
function keyboard(event)
{
	switch(event.key)
	{
		case "a":
			//strafe camera left
			vec3.cross(strafe, look, up); //strafe is cross product of look and up
			move = vec3.create();
			vec3.scale(move, strafe, -speed);
			
			eye = vec3.fromValues(eye[0]+move[0], eye[1], eye[2]+move[2]); //moves eye along xz plane
			//eye = eye + (-speed * strafe);
			break;
		case "d":
			//strafe camera right
			vec3.cross(strafe, look, up);
			move = vec3.create();
			vec3.scale(move, strafe, speed);
			
			eye = vec3.fromValues(eye[0]+move[0], eye[1], eye[2]+move[2]);
			//eye = eye + (speed * strafe);
			break;
		case "w":
			//move camera forward
			move = vec3.create();
			vec3.scale(move, look, speed); //moving forward by a portion of the look vector
			eye = vec3.fromValues(eye[0]+move[0], eye[1], eye[2]+move[2]); 
			//eye = eye + (speed * look); 
			break;
		case "s":
			//move camera backwards
			move = vec3.create();
			vec3.scale(move, look, -speed);
			eye = vec3.fromValues(eye[0]+move[0], eye[1], eye[2]+move[2]);
			//eye = eye = (-speed * look);
			break;
		case "r":
			//move camera up
			move = vec3.create();
			vec3.scale(move, up, 0.2*speed);
			eye = vec3.fromValues(eye[0], eye[1]+move[1], eye[2]);
			//eye = eye = (speed * up);
			break;
		case "f":
			//move camera down
			move = vec3.create();
			vec3.scale(move, up, -0.2*speed);
			eye = vec3.fromValues(eye[0], eye[1]+move[1], eye[2]);
			//eye = eye = (-speed * up);
			break;		
		case "t":
			document.exitPointerLock(); //exits pointer lock so canvas can be left
			break;
		default:
			console.log("another key pressed");
	}

}

//locks pointer on screen so canvas cannot be left
function mousedown(event)
{
	canvas.requestPointerLock();
}

init ();

// Register event handler
window.addEventListener("keydown",keyboard);
canvas.addEventListener("mousemove", mousemove);
canvas.addEventListener("mousedown", mousedown);