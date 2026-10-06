function Features() {

  const features = [
    {
      title: "Application Tracking",
      description:
        "Organize all your job applications, companies, and positions in one professional workspace.",
      icon: "📋",
    },

    {
      title: "Interview Management",
      description:
        "Track interview schedules, preparation notes, and important career milestones.",
      icon: "🎯",
    },

    {
      title: "Career Analytics",
      description:
        "Analyze your progress with statistics and insights about your job search.",
      icon: "📊",
    },

    {
      title: "Resume Intelligence",
      description:
        "Improve your resume and discover opportunities to strengthen your profile.",
      icon: "🤖",
    },
  ];


  return (

    <section className="py-24 px-10">


      <div className="text-center mb-16">

        <h2 className="text-4xl font-bold text-white">

          Everything you need to manage your career

        </h2>


        <p className="mt-4 text-slate-400">

          A complete platform designed for students and professionals.

        </p>

      </div>



      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">


        {features.map((feature, index) => (

          <div
            key={index}
            className="
            bg-slate-900/50
            border
            border-slate-800
            rounded-2xl
            p-8
            hover:border-cyan-400
            transition
            "
          >


            <div className="text-4xl mb-5">

              {feature.icon}

            </div>


            <h3 className="text-xl font-semibold text-white">

              {feature.title}

            </h3>


            <p className="mt-4 text-slate-400 leading-relaxed">

              {feature.description}

            </p>


          </div>

        ))}


      </div>


    </section>

  );

}


export default Features;