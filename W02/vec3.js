Vec3 = function(x,y,z)
{
    window.alert(x0);
    this.x = x;
    this.y = y;
    this.z = z;
}

Vec3.prototype.add = function(v)
{
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
}

Vec3.prototype.sum = function()
{
    return this.x+this.y+this.z;
}

Vec3.prototype.min = function()
{
    var res = this.x;
    if (res > this.y)
    {
        res = this.y;
    }
    if(res > this.z)
    {
        res = this.z;
    }
    return res;
}

Vec3.prototype.mid = function()
{
    var a = this.x;
    var b = this.y;
    var c = this.z;
    if(a < b){
        var temp = a;
        a = b;
        b = temp;
    }
    if(b < c){
        var temp = b;
        b = c;
        c = temp;
    }
    if(a < b){
        var temp = a;
        a = b;
        b = temp;
    }
    return b;
}

Vec3.prototype.max = function()
{
    var a = this.x;
    var b = this.y;
    var c = this.z;
    if(a < b){
        var temp = a;
        a = b;
        b = temp;
    }
    if(b < c){
        var temp = b;
        b = c;
        c = temp;
    }
    if(a < b){
        var temp = a;
        a = b;
        b = temp;
    }
    return a;
}

function dob(x){
    return x*x;
}

function AreaOfTriangle(v0,v1,v2)
{
    return Math.sqrt(dob(v0.y*v1.z-v0.z*v1.y)+dob(v0.z*v1.x-v0.x*v1.z)+dob(v0.x*v1.y-v0.y*v1.x))/2.0
}
