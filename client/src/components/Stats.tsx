function Stats() {
  return (
    <section className="py-20 px-10">

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">


        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">

          <h2 className="text-5xl font-bold text-cyan-400">
            50+
          </h2>

          <p className="mt-3 text-slate-400">
            Applications Managed
          </p>

        </div>



        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">

          <h2 className="text-5xl font-bold text-indigo-400">
            20+
          </h2>

          <p className="mt-3 text-slate-400">
            Interviews Tracked
          </p>

        </div>



        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">

          <h2 className="text-5xl font-bold text-cyan-400">
            90%
          </h2>

          <p className="mt-3 text-slate-400">
            Career Organization
          </p>

        </div>


      </div>

    </section>
  );
}

export default Stats;