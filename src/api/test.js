import postgres from "postgres";

//https://stackoverflow.com/questions/70714690/buffer-is-not-defined-in-react-vite

const sql = postgres(import.meta.env.VITE_CONN_STR);


const app = require("express");

app.get("/api/test", async (req, res) =>{
        try{
        const result = await sql`SELECT id, summary FROM my_summary LIMIT 1`;
        res.status(404).json(result);
    } catch (e){
        res.status(500).send("Error");
    }
})
