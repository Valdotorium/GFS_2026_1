

//function to check input values and correct them if they are out of bounds
function checkValues(){
    //ensure that all input values are within reasonable ranges
    const length = document.getElementById("length").value;
    const mass = document.getElementById("mass").value;
    const angle = document.getElementById("angle").value;
    const gravity = document.getElementById("gravity").value;
    const radius = document.getElementById("radius").value;
    const timeStep = document.getElementById("timeStep").value;
    const airResistance = document.getElementById("airResistance").value;

    //check ranges
    if(length < 0.001) document.getElementById("length").value = 0.001;
    if(length > 100) document.getElementById("length").value = 100;

    if(mass < 0.0001) document.getElementById("mass").value = 0.0001;
    if(mass > 1000) document.getElementById("mass").value = 1000;

    if(angle < -1000) document.getElementById("angle").value = -1000;
    if(angle > 1000) document.getElementById("angle").value = 1000;

    if(gravity < 0) document.getElementById("gravity").value = 0;
    if(gravity > 20) document.getElementById("gravity").value = 20;

    if(radius < 0.01) document.getElementById("radius").value = 0.01;
    if(radius > 100) document.getElementById("radius").value = 100;

    if(timeStep < 0.0001) document.getElementById("timeStep").value = 0.0001;
    if(timeStep > 1) document.getElementById("timeStep").value = 1;

    if(airResistance < 0) document.getElementById("airResistance").value = 0;
    if(airResistance > 5) document.getElementById("airResistance").value = 5;

}

//function for drawing a grid on the canvas
function drawGrid(length, canvas, ctx) {

    //draw a grid divided into meters, one meter is 200/length pixels
    const meterInPixels = 200 / length;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.strokeStyle = '#BFBFBF';
    ctx.lineWidth = 1;
    //for zooms meterInPixels greater than 400, draw tenth meter lines
    if(meterInPixels > 300) {

        for(let i = -10; i <= 10; i++) {
            //vertical lines
            ctx.beginPath();
            ctx.moveTo(centerX + i * meterInPixels / 10, 0);
            ctx.lineTo(centerX + i * meterInPixels / 10, canvas.height);
            ctx.stroke();

            //horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, centerY + i * meterInPixels / 10);
            ctx.lineTo(canvas.width, centerY + i * meterInPixels / 10);
            ctx.stroke();
        }
    }
    ctx.strokeStyle = '#BFBFBF';
    ctx.lineWidth = 1;
    //for Zooms meterInPixels greater than 150, draw quarter meter lines
    if(meterInPixels > 150 && meterInPixels <= 300) {
        for(let i = -10; i <= 10; i++) {
            //vertical lines
            ctx.beginPath();
            ctx.moveTo(centerX + i * meterInPixels / 4, 0);
            ctx.lineTo(centerX + i * meterInPixels / 4, canvas.height);
            ctx.stroke();
            
            //horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, centerY + i * meterInPixels / 4);
            ctx.lineTo(canvas.width, centerY + i * meterInPixels / 4);
            ctx.stroke();
        }
    }
    ctx.strokeStyle = '#AAAAAA';
    ctx.lineWidth = 2;
    //always draw full meter lines
    for(let i = -10; i <= 10; i++) {
        //vertical lines
        ctx.beginPath();
        ctx.moveTo(centerX + i * meterInPixels, 0);
        ctx.lineTo(centerX + i * meterInPixels, canvas.height);
        ctx.stroke();

        //horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, centerY + i * meterInPixels);
        ctx.lineTo(canvas.width, centerY + i * meterInPixels);
        ctx.stroke();
    }

    //add references
    ctx.strokeStyle = '#000000';
    if(meterInPixels > 300) {
        //draw a reference line for 0,10m in the top left corner with a label
        ctx.beginPath();
        ctx.moveTo(20,20);
        ctx.lineTo(20 + meterInPixels / 10, 20);
        ctx.stroke();
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText('0.1 m', 25 + meterInPixels / 10, 25);
    }
    else { if(meterInPixels > 150 && meterInPixels <= 300) {
        //draw a reference line for 0,25m in the top left corner with a label
        ctx.beginPath();
        ctx.moveTo(20,20);
        ctx.lineTo(20 + meterInPixels / 4, 20);
        ctx.stroke();
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText('0.25 m', 25 + meterInPixels / 4, 25);
    }
    else {
        //draw a reference line for 1m in the top left corner with a label
        ctx.beginPath();
        ctx.moveTo(20,20);
        ctx.lineTo(20 + meterInPixels, 20);
        ctx.stroke();
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText('1 m', 25 + meterInPixels, 25);
    }}

}

//function for simulating the pendulums angular velocity with drag
function simulatePendulum(length, mass, angle, angularVelocity, gravity, timeStep) {
    let angularAcceleration = 0;
    //calculate angular acceleration
    angularAcceleration = (-gravity / length) * Math.sin(angle);

    //calculate air resistance
    const airResistanceCoefficient = document.getElementById("airResistance").value; //dimensionless
    const airDensity = 1.2; //kg/m^3
    const bobRadius = document.getElementById("radius").value / 100; //basically like when drawing the bob, but without scaling to pixels
    const bobCrossSectionalArea = Math.PI * bobRadius * bobRadius;
    const dragForce = 0.5 * airResistanceCoefficient * airDensity * bobCrossSectionalArea * (length * angularVelocity) * (length * angularVelocity);
    const dragAngularAcceleration = dragForce / (mass * length); 

    //subtract drag angular acceleration from angular acceleration
    if(angularVelocity > 0) {
        angularAcceleration -= dragAngularAcceleration;
    } else {
        angularAcceleration += dragAngularAcceleration;
    }

    //source: (https://www.myphysicslab.com/pendulum/pendulum-de.html)

    //update angular velocity
    let newAngularVelocity = angularVelocity + angularAcceleration * timeStep;
    return {newAngularVelocity, dragForce};
}

//function to update the peak angle and period display, called when pendulum reaches its peak once every period
function updatePendulumPeak(angle, timeStep, frame, lastMaxAngle) {
    //update the maximum angle display
    document.getElementById("maxAngle").innerText = "Amplitude of latest period: " + (angle * 180 / Math.PI * 2).toFixed(2) + " °";
    //update the period display
    const period = (frame - lastMaxAngle) * timeStep;
    console.log("Period: " + period + " s", frame, lastMaxAngle);
    document.getElementById("period").innerText = "Period: " + period.toFixed(2) + " s";
}

//function to update most displayed values
function updateDisplays(length, mass, angle, angularVelocity, gravity, timeStep, frame, dragForce) {
    //calculate energies
    const energies = calculateEnergies(length, mass, angle, angularVelocity, gravity);
    
    //display the energies
    document.getElementById("potentialEnergy").innerText = "Potential Energy: " + energies.potentialEnergy.toFixed(2) + " J";
    document.getElementById("kineticEnergy").innerText = "Kinetic Energy: " + energies.kineticEnergy.toFixed(2) + " J";
    document.getElementById("totalEnergy").innerText = "Total Energy: " + (energies.potentialEnergy + energies.kineticEnergy).toFixed(1) + " J";
    document.getElementById("time").innerText = "t: " + (timeStep * frame).toFixed(2) + " s";
    //update drag force display
    document.getElementById("dragForce").innerText = "Drag Force: " + dragForce.toFixed(4) + " N";
    //update angle display in degrees
    document.getElementById("angleDisplay").innerText = "Angle: " + (angle * 180 / Math.PI).toFixed(2) + " °";
    //update angular velocity display in degrees per second
    document.getElementById("angularVelocityDisplay").innerText = "Angular Velocity: " + (angularVelocity * 180 / Math.PI).toFixed(2) + " °/s";
}

//main update function for the pendulum, first simulates, and then draws the pendulum and updates displays. Calls itself.
function updatePendulum(length, mass, angle, angularVelocity, gravity, timeStep, frame, zoom, lastMaxAngleFrame) {
    //starting time measurement to measure computation time of the frame
    const startTime = performance.now();

    //calculate angular acceleration

    let newData= simulatePendulum(length, mass, angle, angularVelocity, gravity, timeStep);
    let newAngularVelocity = newData.newAngularVelocity;
    let dragForce = newData.dragForce;
    let newAngle = angle + newAngularVelocity * timeStep;
    drawPendulum(length, newAngle, mass, gravity, zoom);

    //check if user wants to speed up simulation
    if (document.getElementById("speedUp").checked) {
        var simulationSpeed = 50; //speed up by factor of 5
    } else {
        var simulationSpeed = 1; //normal speed
    }

    //check if pendulum reached its peak
    if(Math.sign(angularVelocity) != Math.sign(newAngularVelocity) && angularVelocity > 0) {
        updatePendulumPeak(angle, timeStep, frame, lastMaxAngleFrame);
        lastMaxAngleFrame = frame;
    }
    if (frame == 0){
        updatePendulumPeak(angle, timeStep, frame, lastMaxAngleFrame);
    }

    //update other displays
    updateDisplays(length, mass, newAngle, newAngularVelocity, gravity, timeStep, frame, dragForce);

    //ending time measurement
    const endTime = performance.now();
    const computationTime = endTime - startTime;
    //stopping the simulation = not updating the values relevant for simulation
    if(document.getElementById("stopButton").checked) {
        setTimeout(function() {
        updatePendulum(length, mass, angle, angularVelocity, gravity, timeStep, frame, zoom, lastMaxAngleFrame);
    }, 1 * timeStep * 1000)
    }
    //updating pendulum with new values when simulation is running
    else{setTimeout(function() {
        updatePendulum(length, mass, newAngle, newAngularVelocity, gravity, timeStep, frame + 1, zoom, lastMaxAngleFrame);
    }, 1 * timeStep * 1000 / simulationSpeed - computationTime)};
}

//function to roughly calculate potential and kinetic energy. Unprecise when used with large time steps.
function calculateEnergies(length, mass, angle, angularVelocity, gravity) {
    //calculate potential energy
    const height = length * (1 - Math.cos(angle));
    const potentialEnergy = mass * gravity * height;

    //calculate velocity of the bob
    const velocity = length * angularVelocity;
    const kineticEnergy = 0.5 * mass * velocity * velocity;
    return {potentialEnergy, kineticEnergy};
}

//function to calculate forces acting on the pendulum bob and update their displayed values.
function calculateForces(length, mass, angle, gravity) {

    //calculate forces
    const gravityForce = mass * gravity;
    const tangentialForce = Math.abs(mass * gravity * Math.sin(angle));
    const tensionForce = Math.sqrt(gravityForce * gravityForce - tangentialForce * tangentialForce);

    //and update labels for the force
    document.getElementById("tensionForce").innerText = "Tension Force: " + tensionForce.toFixed(2) + " N";
    document.getElementById("gravityForce").innerText = "Gravity Force: " + gravityForce.toFixed(2) + " N";
    document.getElementById("tangentialForce").innerText = "Tangential Force: " + tangentialForce.toFixed(2) + " N";
    return {gravityForce, tangentialForce, tensionForce};
}

//function to draw the pendulum on the canvas
function drawPendulum(length, angle, mass, gravity, zoom) {
    const canvas = document.getElementById("pendulumCanvas");
    const ctx = canvas.getContext('2d');
    
    //clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //set center position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    //calculate the masses position, angle is in radians
    const bobX = centerX + length * Math.sin(angle) * zoom; //scale length for better visibility
    const bobY = centerY + length * Math.cos(angle) * zoom;
    drawGrid(length, canvas, ctx);

    //draw the rod
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    //draw the bob
    ctx.beginPath();
    const circleRadius = document.getElementById("radius").value / 100 * (200 / length); //scale radius with zoom level

    ctx.arc(bobX, bobY, circleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    //calculate forces
    const forces = calculateForces(length, mass, angle, gravity);
    const gravityForce = forces.gravityForce;
    const tangentialForce = forces.tangentialForce;
    const tensionForce = forces.tensionForce;

    //draw force vectors if checkbox is checked (temporarily removed because not working with certain angles)
/*     if(document.getElementById("showForces").checked) {
        //draw gravity force vector
        //20N equal 200 / length pixels
        const forceScale = 200 / length / 20;
        ctx.beginPath();
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(bobX, bobY + gravityForce * forceScale);
        ctx.strokeStyle = '#0000FF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        //draw tangential force vector
        //calculate the end position of the tangential force vector
        const tangentialX = bobX + tangentialForce * forceScale * Math.cos(angle + Math.PI / 2);
        const tangentialY = Math.abs(bobY + tangentialForce * forceScale * Math.sin(angle + Math.PI / 2));
        ctx.beginPath();
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(tangentialX, tangentialY);
        ctx.strokeStyle = '#009900';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        //draw tension force vector
        
        //calculate the end position of the tension force vector, always pointing towards the pivot
        const tensionX = bobX - tensionForce * forceScale * Math.sin(angle);;
        const tensionY = bobY - tensionForce * forceScale * Math.cos(angle);
        ctx.beginPath();
        ctx.moveTo(bobX, bobY);
        ctx.lineTo(tensionX, tensionY);
        ctx.strokeStyle = '#CC9900';
        ctx.lineWidth = 2;
        ctx.stroke();
    } */
}
//updating parameters in the controls when their value updates
document.getElementById("controls").addEventListener("change", function() {

    const length = document.getElementById("length").value;
    const mass = document.getElementById("mass").value;
    const angle = document.getElementById("angle").value * Math.PI / 180;
    const gravity = document.getElementById("gravity").value; //m/s^2
    const timeStep = 0.02; //s
    const zoom = 200 * (1 / length);


    drawPendulum(length, angle, mass, gravity, zoom);

});

//start script on button click, remove button after click
document.getElementById("startButton").addEventListener("click", function() {
    console.log("Starting pendulum simulation");
    //check input values
    checkValues();
    //set initial parameters
    const length = document.getElementById("length").value;
    const mass = document.getElementById("mass").value;
    const angle = document.getElementById("angle").value * Math.PI / 180;
    const gravity = document.getElementById("gravity").value; //m/s^2
    const timeStep = document.getElementById("timeStep").value; //s
    let totalTime = 0;
    const zoom = 200 * (1 / length);
    const energies = calculateEnergies(length, mass, angle, 0, gravity);
    document.getElementById("totalEnergy").innerText = (energies.potentialEnergy + energies.kineticEnergy).toFixed(2) + " J";

    //make the startButton dissapear
    document.getElementById("startButton").style.display = "none";

    //start the update loop
    updatePendulum(length, mass, angle, 0, gravity, timeStep, totalTime, zoom, 0);
});
//set canvas height based on width to make it responsive
var canvas = document.getElementById('pendulumCanvas');
var heightRatio = 0.75; //height is 75% of width
canvas.height = canvas.width * heightRatio;
//initial draw
drawPendulum(0.38, 45 * Math.PI / 180, 0.045, 9.81, 200 / 0.38);




