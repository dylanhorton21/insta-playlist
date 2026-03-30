/**
 * Copyright 2026 dylanhorton21
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class InstaFox extends DDDSuper(LitElement){
    static get tag(){
        return "insta-fox";
    }
    static properties = {
        photos: {type: Array},
        loading: {type: Boolean},
        activeIndex: {type: Number},
        likes: {type: Object},
        };
        constructor(){
            super();
            this.photos = [];
            this.loading = true;
            this.activeIndex = 0;
            this.likes = {};
        }
        connectedCallback(){
            super.connectedCallback();
            this.loadData();
            this.loadFromStorage();
        }
        async loadData(){
            const url = new URL("./data.json", import.meta.url).href;
            const res = await fetch(url);
            const data = await res.json();
            this.photos = data.photos;
            this.loading = false;
        }
        nextPhoto(){
            if(this.activeIndex < this.photos.length - 1){
                this.activeIndex++;
            }
        }
        previousPhoto(){
            if(this.activeIndex > 0){
                this.activeIndex--;
            }
        }
        dotPhoto(index){
            this.activeIndex = index;
        }
        saveStorage(){
            localStorage.setItem("likes", JSON.stringify(this.likes));
        }
        loadFromStorage(){
            const savedLikes = localStorage.getItem("likes");
            if(savedLikes){
                this.likes = JSON.parse(savedLikes);
            }
        }
        toggleLike(id){
            if(this.likes[id]){
                delete this.likes[id];        
            } else {
                this.likes[id] = true;
            }
            this.likes = {...this.likes};
            this.saveStorage();
        }
        static styles = css`
        .card{
            background: var(--ddd-theme-default-white);
            color: var(--ddd-theme-default-black);
            max-width: 400px;
            margin: 30px auto;
            border: 1px solid #ddd;
            border-radius: 14px;
            background: white;
        }
        .header{
            display: flex;
            justify-content: center;
            padding: 5px;
        }
        .appname{
            font-size: 30px;
        }
        img {
            width: 100%;
            display: block;
        }
        .caption {
            padding: 10px;
        }
        .navigation{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
        
        }
        button{
            border: 1px solid black;
            border-radius: 8px;
            background: var(--ddd-theme-default-white);
            cursor: pointer;
        }
        .allDots{
            display: flex;
            justify-content: center;
            padding: 10px;
            gap: 5px;
        }
        .dot{
            cursor: pointer;
            font-size: 14px;
            color: var(--ddd-theme-default-black);
            opacity: .25;
        }
        .dot.active{
            color: var(--ddd-theme-default-black);
            opacity: 1;

        }
        .heart{
           cursor:pointer;
        }
        `;
        render(){
            
            if(this.loading){
                return html`<p>This loads a fox!!!</p>`;
            }
            const photo = this.photos[this.activeIndex];
            return html`
            <div class = "card">
                <div class="header">
                <div class= "appname">InstaFox</div>
                </div>
                <img src = "${photo.thumbnail}" alt="${photo.name}" loading="lazy" />
                <div class = "caption">
                    <span class="heart" @click="${() =>this.toggleLike(photo.id)}">
                        ${this.likes[photo.id] ? "♥︎" : "♡"}
                    </span>
                    ${photo.name}
                    <div>
                    Fox photos from today
                    </div>
                      
                </div>
                <div class = "navigation">
                    <button @click= "${this.previousPhoto}" ?disabled = "${this.activeIndex === 0}">
                        <
                    </button>

                    
                    <button @click="${this.nextPhoto}" ?disabled = "${this.activeIndex === this.photos.length - 1}">
                        >
                    </button>
                </div>
                <div class = "allDots">
                    ${this.photos.map(
                    (_,index) => html`
                    <span
                    class="dot ${this.activeIndex === index ? "active" : ""}"
                    @click = "${() => this.dotPhoto(index)}"
                    >
                    ●
                </span>
                    `    
                    )}
                </div>
            </div>
            `
            ;
        }
    }
    customElements.define(InstaFox.tag, InstaFox);
        