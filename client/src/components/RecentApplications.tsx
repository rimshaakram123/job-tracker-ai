import { useEffect, useState } from "react";
import api from "../services/api";


function RecentApplications(){

    const [jobs,setJobs] = useState<any[]>([]);


    useEffect(()=>{

        const fetchJobs = async()=>{

            try{

                const token = localStorage.getItem("token");

                const response = await api.get(
                    "/jobs",
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );


                setJobs(response.data.slice(0,5));


            }catch(error){

                console.log(error);

            }

        };


        fetchJobs();


    },[]);



    return(

        <div className="
        mt-10
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-8
        ">


            <h2 className="
            text-2xl
            font-bold
            text-white
            mb-6
            ">
                Recent Applications
            </h2>



            <div className="space-y-4">


            {
                jobs.map((job)=>(

                    <div
                    key={job._id}
                    className="
                    bg-slate-800
                    p-5
                    rounded-xl
                    flex
                    justify-between
                    items-center
                    "
                    >


                        <div>

                            <h3 className="
                            text-white
                            font-semibold
                            text-lg
                            ">
                                {job.company}
                            </h3>


                            <p className="
                            text-slate-400
                            ">
                                {job.position}
                            </p>

                        </div>



                        <span className="
                        text-cyan-400
                        font-semibold
                        ">
                            {job.status}
                        </span>



                    </div>


                ))
            }


            </div>


        </div>


    );

}


export default RecentApplications;