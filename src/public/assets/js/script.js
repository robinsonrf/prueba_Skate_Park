const limpiarTabla = (async () =>{
    const {data} = await axios.get("/skater");
    if (data.length > 0){
        $(".tr-skater").html("");
    }
})();


let statusCheck = document.querySelectorAll(".status");

for (nombre of statusCheck){
    nombre.addEventListener("click", async (e)=>{
        try{
            const estado = e.target.checked;
            const id = e.target.name;
            await axios.put("/skaters", {id, estado});
            alert(estado? "Skater ha sido Aprobado!!": "Skater en Revision");
        }catch (e){
            console.log(e)
        }
    })
}