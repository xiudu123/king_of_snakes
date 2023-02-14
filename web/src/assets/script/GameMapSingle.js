import { Cell } from "./Cell";
import { Food } from "./food";
import { GameMap } from "./GameMap";
import { SnakesSingle } from "./SnakesSingle";
export class GameMapSingle extends GameMap {
    constructor(ctx, parent, store){
        super(ctx, parent);
        this.ctx = ctx;
        this.store = store;
        let r = parseInt(Math.random() * (this.rows - 2) + 1);
        let c = parseInt(Math.random() * (this.cols - 2) + 1);
        this.snake = new SnakesSingle({id: 0, color: "#4876ec", r: r, c: c, eye_direction: 0}, this);
        this.food = null;
        this.directions = [];
    }
    add_listening_even(){
        this.ctx.canvas.focus();
        this.ctx.canvas.addEventListener("keydown", e => {
            if(e.key === 'w') this.directions.push(0);
            else if(e.key === 'a') this.directions.push(1);
            else if(e.key === 's') this.directions.push(2);
            else if(e.key === 'd') this.directions.push(3);

            else if(e.key === "ArrowUp") this.directions.push(0);
            else if(e.key === "ArrowLeft") this.directions.push(1);
            else if(e.key === "ArrowDown") this.directions.push(2);
            else if(e.key === "ArrowRight") this.directions.push(3);
            console.log(this.directions);
        });
    }

    start_gamemap(){
        this.add_listening_even();
    }

    check_food_exist(){
        if(this.food === null){
            let gg = [];
            for(let r = 0; r < this.rows; ++ r){
                for(let c = 0; c < this.cols; ++ c){
                    if(!this.g[r][c]) gg.push(new Cell(r, c));
                }
            }
            if(gg.length >= 1){
                let x = parseInt(Math.random() * (gg.length - 1));
                this.food = new Food(gg[x].r, gg[x].c, this);
            }
        }
    }


    add_score(){
        this.store.commit("addScore", 10);
        console.log(this.store.state.pkSingle.score);
    }

    check_eat_food(cell){
        if(cell.r === this.food.r && cell.c === this.food.c) return true;
        return false;
    }
    destoer_food(){
        this.food.destory();
        this.food = null;
    }
    check_ready(){
        if(this.snake.status === "die") return false;
        if(this.snake.status !== "idle") return false;
        if(this.directions.length === 0 && this.snake.last_direction === -1) return false;
        return true;
    }

    update_gamemap(){
        if(this.check_ready()){
            if(this.directions.length === 0) this.snake.direction = this.snake.last_direction;
            else {
                this.snake.direction = this.directions[0];
                this.directions.splice(0);
            }
            this.snake.last_direction = this.snake.direction;
            this.snake.next_step();
            if(this.check_eat_food(this.snake.cells[0])) {
                this.destoer_food();
                this.add_score();
            }
        }
        
        this.check_food_exist();
    }

}