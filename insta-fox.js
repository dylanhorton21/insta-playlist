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
        author:{type:Object},
        channel:{type: String},
        };
        constructor(){
            super();
            this.photos = [];
            this.loading = true;
            this.activeIndex = 0;
            this.likes = {};
            const params = new URLSearchParams(window.location.search);
            const index = Number(params.get("activeIndex"));
            if(!isNaN(index)){
                this.activeIndex = index;
            }
            this.author ={};
            this.channel = "";
        }
        connectedCallback(){
            super.connectedCallback();
            this.loadData();
            this.loadFromStorage();
        }
        async loadData(){
            const res = await fetch("/api/foxphotos");
            const data = await res.json();
            this.photos = data.photos;
            this.loading = false;
            this.author = data.author;
            this.channel = data.channel;
        }
        nextPhoto(){
            if(this.activeIndex < this.photos.length - 1){
                this.activeIndex++;
                this.updateQueryParam("activeIndex", this.activeIndex);
            }
        }
        previousPhoto(){
            if(this.activeIndex > 0){
                this.activeIndex--;
                this.updateQueryParam("activeIndex", this.activeIndex);
            }
        }
        dotPhoto(index){
            this.activeIndex = index;
            this.updateQueryParam("activeIndex", this.activeIndex);
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
        async share(){
            try{
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied");
            }
            catch (error){
                console.error("Copy error", error);
            }
            }
        
        updateQueryParam(key,value){
            const currentURL = new URL(window.location.href);
            currentURL.searchParams.set(key, value);
            history.pushState(null, "", currentURL.toString())
        }

        static styles = css`
        :host{
            color-scheme: light dark;
        }
        .card{
            background: light-dark(var(--ddd-theme-default-white), black);
            color: light-dark(var(--ddd-theme-default-black), white);
            max-width: 400px;
            margin: 30px auto;
            border: 1px solid light-dark(#ddd,black);
            border-radius: 14px;
            width: min(400px, 92vw);
        }
        .header{
            padding: 5px;
        }
        .appname{
            font-size: 30px;
        }
        .image{
            width: 100%;
            height: 500px;
            overflow: hidden;
            background: light-dark(var(--ddd-theme-default-white), black);
            display: block;
        }
        .image img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        
        .caption {
            padding: 10px;
            color: light-dark(var(--ddd-theme-default-black), white);
        }
        .navigation{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
        
        }
        button{
            border: 1px solid light-dark(black, white);
            border-radius: 8px;
            background: light-dark(var(--ddd-theme-default-white), black);
            color: light-dark(var(--ddd-theme-default-black), white);
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
            color: light-dark(var(--ddd-theme-default-black), white);
            opacity: .25;
        }
        .dot.active{
            color: light-dark(var(--ddd-theme-default-black), white);
            opacity: 1;

        }
        .heart{
           cursor:pointer;
           color: light-dark(var(--ddd-theme-default-black), white);
        }
            
        
        `;
        render(){
            
            if(this.loading){
                return html`<p>Loading page</p>`;
            }
            const photo = this.photos[this.activeIndex];
            return html`
            <div class = "card">
                <div class="header">
                <span>${this.author.name}</span>
                <span style="float:right;">${this.channel}</span>
                </div>
                <a href ="${photo.fullSource}" target="_blank" class="image">
                <img src = "${photo.thumbnail}" alt="${photo.name}" loading="lazy" />
                </a>
                <div class = "caption">
                    <span class="heart" @click="${() =>this.toggleLike(photo.id)}">
                        ${this.likes[photo.id] ? "♥︎" : "♡"}
                    </span>
                    <button @click="${this.share}">Share</button>
                    ${photo.name}
                    <div></div>
                    ${photo.description}, ${photo.dateTaken}
                    
                      
                </div>
                <div class = "navigation">
                    <button @click= "${this.previousPhoto}" ?disabled = "${this.activeIndex === 0}" title="Previous photo">
                        Previous
                    </button>

                    
                    <button @click="${this.nextPhoto}" ?disabled = "${this.activeIndex === this.photos.length - 1}" title="Next photo">
                        Next
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
        