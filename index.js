
const data = {
    //distant from user to pointX
    distA: 1.1,
    distB: 2.2,
    distC: 1.6,

    //dimensions of triangle
    width: 2.5,
    height: 2.5
}
const trianglePoints = {
    A: [52.042639, 11.704689],
    B: [52.034692, 11.781911],
    C: [51.994786, 11.690978]
}

//calc dist between dwo points using haversine formula
const getDistanceFromLatLon = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

// degree to radians
const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}

// calculate offset from triangle
const triangulate = (data) => {
    // calc y
    var y = 0;
    let sY = (data.distA + data.width + data.distB) / 2
    let tay = sY * (sY - data.distA)*(sY - data.width)*(sY - data.distB)
    let Ay = Math.sqrt(tay)
    let hy = 2 * (Ay / data.width)
    y = hy

    //calc V
    var x = 0;
    let sX = (data.distC + data.height + data.distA) / 2
    let tax = sX * (sX - data.distC)*(sX - data.height)*(sX - data.distA)
    let Ax = Math.sqrt(tax)
    let hx = 2 * (Ax / data.height)
    x = hx

    //Percentages:
    let Px = x / data.width
    let Py = y / data.height
    console.log(`X: ${x}\nY: ${y}`)
    console.log(`Px: ${Px}\nPy: ${Py}`)

    return {
        x: x,
        y: y,
        Px: Px,
        Py: Py
    }
}

//setup function 
const setup = () => {
   
    data.width = getDistanceFromLatLon(trianglePoints.A[0],trianglePoints.A[1],trianglePoints.B[0],trianglePoints.B[1])
    data.height = getDistanceFromLatLon(trianglePoints.A[0],trianglePoints.A[1],trianglePoints.C[0],trianglePoints.C[1])
}

//watch position change
navigator.geolocation.watchPosition((coordinates) => {
    //SUCC
    const { latitude: lat, longitude: long } = coordinates.coords;
    console.log(lat)

    //calc distance to pointA-C
    
    for (let p in trianglePoints) {
        let dist = getDistanceFromLatLon(trianglePoints[p][0],trianglePoints[p][1],lat,long)
        data[`dist${p}`]=dist
    }
    console.log(data)
    let d = triangulate(data)
    document.body.innerHTML=`Data: \n${JSON.stringify(data)}\n\nTriangle: \n${JSON.stringify(d)}`
}, (err) => {
    //ERROR
    console.warn(err)
});

setup()