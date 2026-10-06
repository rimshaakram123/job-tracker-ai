function HowItWorks() {

  const steps = [
    {
      number: "01",
      title: "Add Applications",
      description:
        "Save job opportunities, companies, positions, and important details in one place.",
    },

    {
      number: "02",
      title: "Track Progress",
      description:
        "Manage application stages, interviews, and career activities efficiently.",
    },

    {
      number: "03",
      title: "Analyze Growth",
      description:
        "Use analytics to understand your performance and improve your strategy.",
    },
  ];


  return (

    <section className="py-24 px-10">


      <div className="text-center mb-16">

        <h2 className="text-4xl font-bold text-white">

          How CareerFlow Works

        </h2>


        <p className="mt-4 text-slate-400">

          A simple workflow to organize your career journey.

        </p>

      </div>



      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">


        {steps.map((step, index) => (

          <div
            key={index}
            className="
            bg-slate-900/50
            border
            border-slate-800
            rounded-2xl
            p-8
            text-center
            "
          >

            <div className="text-5xl font-bold text-cyan-400">

              {step.number}

            </div>


            <h3 className="mt-6 text-2xl font-semibold text-white">

              {step.title}

            </h3>


            <p className="mt-4 text-slate-400">

              {step.description}

            </p>


          </div>

        ))}


      </div>


    </section>

  );
}

export default HowItWorks;