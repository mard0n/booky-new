export default function Banner() {
  return (
    <section className="my-12">
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        <div className="h-64 w-full md:h-96">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=600"
            alt="Book collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center bg-gradient-to-r from-black/75 to-transparent">
            <div className="max-w-2xl p-8 md:p-12">
              <h1 className="mb-4 text-2xl font-bold text-white md:text-4xl">
                Kitoblar olamini kashf qiling
              </h1>
              <p className="mb-6 text-sm text-white/90 md:text-lg">
                Yangi nashrlarni, abadiy klassikalarni va yashirin durdonalarni
                kashf eting. Bugun navbatdagi ajoyib o‘qishingizga sho‘ng‘ing!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
