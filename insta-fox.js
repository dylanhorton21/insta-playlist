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
        image: {type: String},
        loading: {type: Boolean},
        };
        constructor(){
            super();
            this.image = "";
            this.loading = true;
        }
        connectedCallback(){
            super.connectedCallback();
            this.fox();
        }
        async fox(){
            const res = await fetch("https://randomfox.ca/floof/");
            const data = await res.json();
            this.image = data.image;
            this.loading = false;
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
        `;
        render(){
            
            if(this.loading){
                return html`<p>This loads a fox!!!</p>`;
            }
            return html`
            <div class = "card">
                <div class="header">
                <div class= "appname">InstaFox</div>
                </div>
                <img src = "${this.image}" loading="lazy" />
                <div class = "caption">
                    ♡  💬  Random Fox Refresh!!
                </div>
            </div>
            `;
        }
    }
    customElements.define(InstaFox.tag, InstaFox);
        