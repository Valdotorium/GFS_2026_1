
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
    //lines for full meters
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
        ctx.fillText('0.1 m / 2 N', 25 + meterInPixels / 10, 25);
    }
    else { if(meterInPixels > 150 && meterInPixels <= 300) {
        //draw a reference line for 0,25m in the top left corner with a label
        ctx.beginPath();
        ctx.moveTo(20,20);
        ctx.lineTo(20 + meterInPixels / 4, 20);
        ctx.stroke();
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText('0.25 m / 5 N', 25 + meterInPixels / 4, 25);
    }
    else {
        //draw a reference line for 1m in the top left corner with a label
        ctx.beginPath();
        ctx.moveTo(20,20);
        ctx.lineTo(20 + meterInPixels, 20);
        ctx.stroke();
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText('1 m / 20 N', 25 + meterInPixels, 25);
    }}

}

function simulatePendulum(length, mass, angle, angularVelocity, gravity, timeStep) {
    let angularAcceleration = 0;
    //calculate angular acceleration
    angularAcceleration = (-gravity / length) * Math.sin(angle);

    //calculate air resistance
    const airResistanceCoefficient = document.getElementById("airResistance").value; //dimensionless
    const airDensity = 1.2; //kg/m^3
    const bobRadius = Math.sqrt(mass) / Math.PI / 4; //basically like when drawing the bob, but without scaling to pixels
    const bobCrossSectionalArea = Math.PI * bobRadius * bobRadius;
    const dragForce = 0.5 * airResistanceCoefficient * airDensity * bobCrossSectionalArea * (length * angularVelocity) * (length * angularVelocity);
    const dragAngularAcceleration = dragForce / (mass * length); 

    //subtract drag angular acceleration from angular acceleration
    if(angularVelocity > 0) {
        angularAcceleration -= dragAngularAcceleration;
    } else {
        angularAcceleration += dragAngularAcceleration;
    }
    //update drag force display
    document.getElementById("dragForce").innerText = "Drag Force: " + dragForce.toFixed(2) + " N";
    //update angle display in degrees
    document.getElementById("angleDisplay").innerText = "Angle: " + (angle * 180 / Math.PI).toFixed(2) + " °";
    //update angular velocity display in degrees per second
    document.getElementById("angularVelocityDisplay").innerText = "Angular Velocity: " + (angularVelocity * 180 / Math.PI).toFixed(2) + " °/s";

    //source: (https://www.myphysicslab.com/pendulum/pendulum-de.html)

    //update angular velocity
    let newAngularVelocity = angularVelocity + angularAcceleration * timeStep;

    return newAngularVelocity;
}



function updatePendulum(length, mass, angle, angularVelocity, gravity, timeStep, frame, zoom) {
    //calculate angular acceleration
    //simulatePendulum(length, mass, angle, gravity, timeStep);
    let newAngularVelocity= simulatePendulum(length, mass, angle, angularVelocity, gravity, timeStep);
    let newAngle = angle + newAngularVelocity * timeStep;
    drawPendulum(length, newAngle, mass, gravity, zoom);
    console.log(frame)

    //calculate energies
    const energies = calculateEnergies(length, mass, newAngle, newAngularVelocity, gravity);

    //display the energies
    document.getElementById("potentialEnergy").innerText = "Potential Energy: " + energies.potentialEnergy.toFixed(2) + " J";
    document.getElementById("kineticEnergy").innerText = "Kinetic Energy: " + energies.kineticEnergy.toFixed(2) + " J";
    document.getElementById("totalEnergy").innerText = "Total Energy: " + (energies.potentialEnergy + energies.kineticEnergy).toFixed(1) + " J";
    document.getElementById("time").innerText = "t: " + (timeStep * frame).toFixed(2) + " s";

    //check if user wants to speed up simulation
    if (document.getElementById("speedUp").checked) {
        var simulationSpeed = 50; //speed up by factor of 5
    } else {
        var simulationSpeed = 1; //normal speed
    }


    //add functionality for a stop checkbox
    if(document.getElementById("stopButton").checked) {
        setTimeout(function() {
        updatePendulum(length, mass, angle, angularVelocity, gravity, timeStep, frame, zoom);
    }, 1 * timeStep * 1000)
    }
    else{setTimeout(function() {
        updatePendulum(length, mass, newAngle, newAngularVelocity, gravity, timeStep, frame + 1, zoom);
    }, 1 * timeStep * 1000 / simulationSpeed)};

}



function calculateEnergies(length, mass, angle, angularVelocity, gravity) {
    //calculate potential energy
    const height = length * (1 - Math.cos(angle));
    const potentialEnergy = mass * gravity * height;

    //calculate velocity of the bob
    const velocity = length * angularVelocity;
    const kineticEnergy = 0.5 * mass * velocity * velocity;
    return {potentialEnergy, kineticEnergy};
}

function drawPendulum(length, angle, mass, gravity, zoom) {
    const canvas = document.getElementById("pendulumCanvas");
    const ctx = canvas.getContext('2d');
    //visualize forces acting on the pendulum bob
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
    const circleRadius = Math.sqrt(mass) / Math.PI  * (200 / length) / 4; //scale radius for better visibility
    console.log("Circle radius: " + circleRadius);
    ctx.arc(bobX, bobY, circleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    //calculate forces
    const gravityForce = mass * gravity;
    const tangentialForce = Math.abs(mass * gravity * Math.sin(angle));
    const tensionForce = Math.sqrt(gravityForce * gravityForce - tangentialForce * tangentialForce);

    //and update labels for the force
    document.getElementById("tensionForce").innerText = "Tension Force: " + tensionForce.toFixed(2) + " N";
    document.getElementById("gravityForce").innerText = "Gravity Force: " + gravityForce.toFixed(2) + " N";
    document.getElementById("tangentialForce").innerText = "Tangential Force: " + tangentialForce.toFixed(2) + " N";

    //draw force vectors if checkbox is checked
    if(document.getElementById("showForces").checked) {
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



    }
}
//updating parameters when their value updates
document.getElementById("controls").addEventListener("change", function() {

    const length = document.getElementById("length").value;
    const mass = document.getElementById("mass").value;
    const angle = document.getElementById("angle").value * Math.PI / 180;
    const gravity = document.getElementById("gravity").value; //m/s^2
    const timeStep = 0.02; //s
    const zoom = 200 * (1 / length);
    console.log(zoom);

    drawPendulum(length, angle, mass, gravity, zoom);

});


//start script on buton click
document.getElementById("startButton").addEventListener("click", function() {
    console.log("Starting pendulum simulation");
    const length = document.getElementById("length").value;
    const mass = document.getElementById("mass").value;
    const angle = document.getElementById("angle").value * Math.PI / 180;
    const gravity = document.getElementById("gravity").value; //m/s^2
    const timeStep = document.getElementById("timeStep").value; //s
    let totalTime = 0;
    const zoom = 200 * (1 / length);

    const energies = calculateEnergies(length, mass, angle, 0, gravity);
    document.getElementById("totalEnergy").innerText = (energies.potentialEnergy + energies.kineticEnergy).toFixed(2) + " J";
    updatePendulum(length, mass, angle, 0, gravity, timeStep, totalTime, zoom);

});

//initial draw
drawPendulum(1.2, 50 * Math.PI / 180, 1, 9.81, 200);




