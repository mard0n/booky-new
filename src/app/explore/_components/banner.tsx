export default function Banner() {
  return (
    <section className="my-12">
      <div className="relative overflow-hidden rounded-xl shadow-lg bg-muted">
        <div className="w-full h-96">
          <img
            src="/explore.png"
            alt="Book collection"
            className="h-[193px] w-auto absolute top-1/2 -translate-y-1/2 right-20"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-2xl p-12">
              <h1 className="mb-4 text-3xl font-libre">
                Bepoyon kitoblar olami
              </h1>
              <p className="mb-6 text-sm font-muted-foreground">
                Yangi nashrlarni, abadiy klassikalarni va yashirin durdonalarni
                kashf eting. Bugun navbatdagi ajoyib sarguzashtga sho‘ng‘ing!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
