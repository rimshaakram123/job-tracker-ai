import { Link } from "react-router-dom";


function Sidebar(){

return(

<aside
className="
w-72
min-h-screen
bg-slate-950
border-r
border-slate-800
p-8
"
>


<h1
className="
text-3xl
font-bold
text-cyan-400
mb-12
"
>
CareerFlow
</h1>



<nav className="space-y-6">


<Link
to="/dashboard"
className="
flex
items-center
gap-3
text-slate-300
hover:text-cyan-400
transition
"
>
🏠 Dashboard
</Link>



<Link
to="/applications"
className="
flex
items-center
gap-3
text-slate-300
hover:text-cyan-400
transition
"
>
💼 Applications
</Link>



<Link
to="/analytics"
className="
flex
items-center
gap-3
text-slate-300
hover:text-cyan-400
transition
"
>
📊 Analytics
</Link>



<Link
to="/profile"
className="
flex
items-center
gap-3
text-slate-300
hover:text-cyan-400
transition
"
>
👤 Profile
</Link>


</nav>


<div
className="
absolute
bottom-8
"
>

<button
className="
text-red-400
hover:text-red-300
"
>
Logout
</button>


</div>


</aside>


);

}


export default Sidebar;