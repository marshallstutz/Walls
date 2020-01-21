function Bat(){
  this.len = 50;
  this.left = random(width-51);
  this.right = this.left + 80;
  this.y = height;
  this.w = 30;

  this.highlight = false;

  this.show = function(){
    fill(255);
    if(this.highlight){
      fill(255,0,0);
    }
    rect(0, this.y, this.left, this.w);
    rect(this.right, this.y, width, this.w);
  }

  this.update = function(){
    this.y -= 5;
  }

  this.offscreen = function(){
    return this.y < -this.w;
  }

  this.hits = function(bird){
    if(bird.x < this.left || bird.x > this.right){
      if(bird.y > this.y && bird.y < this.y + this.w){
        this.highlight = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }
}
