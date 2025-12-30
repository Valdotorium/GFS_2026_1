
function simulatePendulum(length, mass, angle, angularVelocity, gravity, timeStep) {
    let angularAcceleration = 0;
    //calculate angular acceleration
    angularAcceleration = (-gravity / length) * Math.sin(angle);

    //update angular velocity
    let newAngularVelocity = angularVelocity + angularAcceleration * timeStep;

    return newAngularVelocity;
}



function updatePendulum(length, mass, angle, angularVelocity, gravity, timeStep, frame) {
    //calculate angular acceleration
    //simulatePendulum(length, mass, angle, gravity, timeStep);
    let newAngularVelocity= simulatePendulum(length, mass, angle, angularVelocity, gravity, timeStep);
    let newAngle = angle + newAngularVelocity * timeStep;
    drawPendulum(length, newAngle, mass);
    console.log(frame)

    //calculate energies
    const energies = calculateEnergies(length, mass, newAngle, newAngularVelocity, gravity);

    //display the energies
    document.getElementById("potentialEnergy").innerText = "Potential Energy: " + energies.potentialEnergy.toFixed(2) + " J";
    document.getElementById("kineticEnergy").innerText = "Kinetic Energy: " + energies.kineticEnergy.toFixed(2) + " J";
    document.getElementById("totalEnergy").innerText = "Total Energy: " + (energies.potentialEnergy + energies.kineticEnergy).toFixed(1) + " J";
    document.getElementById("time").innerText = "t: " + (timeStep * frame).toFixed(2) + " s";


    setTimeout(function() {
        updatePendulum(length, mass, newAngle, newAngularVelocity, gravity, timeStep, frame + 1);
    }, 1 * timeStep * 1000);

}

//start script on buton click
document.getElementById("startButton").addEventListener("click", function() {
    console.log("Starting pendulum simulation");
    const length = document.getElementById("length").value;
    const mass = document.getElementById("mass").value;
    const angle = document.getElementById("angle").value * Math.PI / 180;
    const gravity = 9.81; //m/s^2
    const timeStep = document.getElementById("timeStep").value; //s
    let totalTime = 0;

    const energies = calculateEnergies(length, mass, angle, 0, gravity);
    document.getElementById("totalEnergy").innerText = (energies.potentialEnergy + energies.kineticEnergy).toFixed(2) + " J";
    updatePendulum(length, mass, angle, 0, gravity, timeStep, totalTime);

});


function calculateEnergies(length, mass, angle, angularVelocity, gravity) {
    //calculate potential energy
    const height = length * (1 - Math.cos(angle));
    const potentialEnergy = mass * gravity * height;

    //calculate velocity of the bob
    const velocity = length * angularVelocity;
    const kineticEnergy = 0.5 * mass * velocity * velocity;
    return {potentialEnergy, kineticEnergy};
}

function drawPendulum(length, angle, mass, gravity) {
    const canvas = document.getElementById("pendulumCanvas");
    const ctx = canvas.getContext('2d');
    //visualize forces acting on the pendulum bob
    //clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //set center position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    //calculate the masses position, angle is in radians
    const bobX = centerX + length * Math.sin(angle) * 200; //scale length for better visibility
    const bobY = centerY + length * Math.cos(angle) * 200;

    //draw the rod
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    //draw the bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, mass * 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    if(document.getElementById("showForces").checked) {

    }
}
//updating parameters when their value updates
document.getElementById("controls").addEventListener("change", function() {
    console.log("Starting pendulum simulation");
    const length = document.getElementById("length").value;
    const mass = document.getElementById("mass").value;
    const angle = document.getElementById("angle").value * Math.PI / 180;
    const gravity = 9.81; //m/s^2
    const timeStep = 0.02; //s

    drawPendulum(length, angle, mass, gravity);

});
drawPendulum(1.2, 50 * Math.PI / 180, 3, 9.81);




