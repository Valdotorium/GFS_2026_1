
function simulatePendulum(length, mass, angle, gravity, timeStep, totalTime) {

}

function drawPendulum(length, angle, mass) {    
    //get the canvas and context
    const canvas = document.getElementById("pendulumCanvas");
    const ctx = canvas.getContext('2d');

    //clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //set center position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 4;

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
    simulatePendulum(length, mass, angle, gravity, timeStep);

    drawPendulum(length, angle, mass);
}


drawPendulum(200, Math.PI / 4, 20);

