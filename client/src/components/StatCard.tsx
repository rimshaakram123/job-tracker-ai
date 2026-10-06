interface Props {
  title: string;
  value: number;
  color: string;
}


function StatCard({title,value,color}:Props){

return (

<div
className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-6
"
>


<h3 className="text-slate-400">
{title}
</h3>


<p
className={`text-5xl font-bold mt-4 ${color}`}
>

{value}

</p>


</div>

);

}


export default StatCard;