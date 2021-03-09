var dog, sadDog, happyDog;
var food;
var foodS, foodstock;
var feed, addFood, lastFed, fedTime

function preload()
{
	sadDog=loadImage("images/sadDog.png");
  happyDog=loadImage("images/happyDog.png");
}

function setup() {
  database=firebase.database();
	createCanvas(1000,400);

  food = new Food();
  foodstock = database.ref("Food Stock");
  foodstock.on("value",readStock);
 
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);


}


function draw() {
  background("darkGreen");
  
  food.display();

  fedTime= database.ref("FeedTime");
  fedTime.on("value",function(data){
    lastFed = data.val();
  }
  )

  fill("white");
  textSize(15);
  if(lastFed>=12){
    text("Last Fed: "+ lastFed % 12+ "PM", 350, 30);
  }
  else if(lastFed===0){
    text("Last Fed:12 AM ",350,30);
  }
  else{
    text("Last Fed: "+ lastFed + "AM", 350, 30);  
  }

 drawSprites();

}

function readStock(data){
  foodS = data.val();
  food.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  food.updateFoodStock(food.getFoodStock()-1);
  database.ref("/").update({
    Food: food.getFoodStock(),
    FeedTime: hour()
  }
  )
}

function addFoods(){
  foodS++;
  database.ref("/").update({
    Food: foodS
  })
  food.display();
}




