
function simulatePendulum(length, mass, angle, angularVelocity, gravity, timeStep) {
    let angularAcceleration = 0;


    //calculate angular acceleration
    angularAcceleration = (-gravity / length) * Math.sin(angle);
    
    //update angular velocity
    let newAngularVelocity = angularVelocity + angularAcceleration * timeStep;

    return newAngularVelocity;
}

function drawPendulum(length, angle, mass) {    
    //get the canvas and context
    const canvas = document.getElementById("pendulumCanvas");
    const ctx = canvas.getContext('2d');

    //clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //set center position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    //calculate the masses position, angle is in radians
    const bobX = centerX + length * Math.sin(angle);
    const bobY = centerY + length * Math.cos(angle);

    //draw the rod
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    //draw the bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, mass, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.stroke();
}


function updatePendulum(length, mass, angle, angularVelocity, gravity, timeStep) {
    //calculate angular acceleration
    //simulatePendulum(length, mass, angle, gravity, timeStep);
    let newAngularVelocity= simulatePendulum(length, mass, angle, angularVelocity, gravity, timeStep);
    let newAngle = angle + newAngularVelocity * timeStep;
    drawPendulum(length, newAngle, mass);
    console.log(angularVelocity)


    setTimeout(function() {
        updatePendulum(length, mass, newAngle, newAngularVelocity, gravity, timeStep);
    }, 20);

}

//start script on buton click
document.getElementById("startButton").addEventListener("click", function() {
    console.log("Starting pendulum simulation");
    const length = document.getElementById("length").value;
    const mass = document.getElementById("mass").value;
    const angle = document.getElementById("angle").value * Math.PI / 180;
    const gravity = 9.81; //m/s^2
    const timeStep = document.getElementById("timeStep").value; //s

    updatePendulum(length, mass, angle, 0, gravity, timeStep);

});

drawPendulum(140, 40 * Math.PI / 180, 20);

//updating parameters when their value updates
document.getElementById("controls").addEventListener("change", function() {
    console.log("Starting pendulum simulation");
    const length = document.getElementById("length").value;
    const mass = document.getElementById("mass").value;
    const angle = document.getElementById("angle").value * Math.PI / 180;
    const gravity = 9.81; //m/s^2
    const timeStep = 0.02; //s

    drawPendulum(length, angle, mass);

});


