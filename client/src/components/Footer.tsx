function Footer() {

  return (

    <footer className="
    border-t
    border-slate-800
    py-10
    px-10
    ">


      <div className="
      max-w-6xl
      mx-auto
      grid
      md:grid-cols-4
      gap-8
      ">


        <div>

          <h2 className="
          text-2xl
          font-bold
          bg-gradient-to-r
          from-cyan-400
          to-indigo-500
          bg-clip-text
          text-transparent
          ">
            CareerFlow
          </h2>


          <p className="mt-4 text-slate-400">

            Intelligent career management platform.

          </p>

        </div>



        <div>

          <h3 className="text-white font-semibold">
            Product
          </h3>

          <p className="mt-3 text-slate-400">
            Features
          </p>

          <p className="text-slate-400">
            Dashboard
          </p>

        </div>



        <div>

          <h3 className="text-white font-semibold">
            Company
          </h3>

          <p className="mt-3 text-slate-400">
            About
          </p>

          <p className="text-slate-400">
            Contact
          </p>

        </div>



        <div>

          <h3 className="text-white font-semibold">
            Resources
          </h3>

          <p className="mt-3 text-slate-400">
            Documentation
          </p>

          <p className="text-slate-400">
            GitHub
          </p>

        </div>


      </div>


      <div className="
      text-center
      mt-10
      text-slate-500
      ">

        © 2026 CareerFlow. All rights reserved.

      </div>


    </footer>

  );

}


export default Footer;