import { useEffect } from "react"

export default function Chart({id}){ 
  useEffect(()=>{
    console.log("ID CHART: ", id);
    
  })
  
  return (
    <>
    {id}
    </>
  )
}