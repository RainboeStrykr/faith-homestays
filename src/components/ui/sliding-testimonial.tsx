const testimonials = [
  {
    name: "Vishwajeet Sinha",
    profession: "Local Guide",
    description:
      "The place is extremely Neat. It had got such relaxing  vibes!! The place is really calming. Clean rooms, no mosquito, nice terrace, beautiful lobby, Indo-western look!!",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjXK2revD1DkYechYCxQ8tIBRikLl686HsoMdstbflggFwNiAsRr=w47-h47-p-rp-mo-ba12-br100",
    image: "/full-size-logo.jpg",
  },
  {
    name: "Lawrence Gomes",
    profession: "Backpacker from Kerala",
    description:
      "I stayed in the dorms where the bunk beds were clean and comfortable, the behaviour of the owner was good and friendly, the breakfast was tasty. Going to stay here again and this time in the AC rooms",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWkpS3UB0K87JxxBf-wveP1fClY5xOLA2JwBF-etkaVOKM2TQgU=w47-h47-p-rp-mo-ba12-br100",
    image: "/full-size-logo.jpg",
  },
  {
    name: "Shrayon Chanda",
    profession: "Traveller from Kolkata",
    description:
      "The people here are very helpful and warm. The location, the service, the behaviour everything is top notch. Surely will come back again, whenever I am in Siliguri.",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUg_PgCKW4sVHyfE1uhrq8NdKIveAM4pPfYkD4llzsiO3sIz9tM=w47-h47-p-rp-mo-br100",
    image: "/full-size-logo.jpg",
  },
  {
    name: "Sujan Sarkar",
    profession: "Family trip from Bengaluru",
    description:
      "Really a place which is reasonably priced with   neat rooms, though small but cozy enough. People wanting to stay at homestay which is accessible, it's the place. With eateries at a stone throw all the more good. Helpful staff.",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUTIKNWSy3OR7JrClBnExRHKjO9jXojL4noiATIdiOQkfV6ZuQ=w47-h47-p-rp-mo-br100",
    image: "/full-size-logo.jpg",
  },
  {
    name: "Rahul Paswan",
    profession: "Solo trip for trekking",
    description:
      "The rooms are spotless, cozy, and thoughtfully designed, making it feel just like home. I especially loved how peaceful and quiet the surroundings were, allowing me to relax and unwind after a busy day. The location is also very convenient—close to markets, transportation, and local eateries, yet tucked away enough to feel calm and safe.",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWIUKNDB_PyWjuFKDSseloJ7GMBGJKQI2-ErP9t8pyoHai_m9e02Q=w47-h47-p-rp-mo-br100",
    image: "/full-size-logo.jpg",
  },
  {
    name: "Clemens Walter",
    profession: "Couple from Germany",
    description:
      "The most important thing for us about this very well-located and centrally situated homestay was the owner's friendly and helpful nature. He was available for all our questions and very helpful; he also runs a travel agency. The room and bathroom were very clean and well-maintained, and we were also able to use the terrace. My girlfriend and I felt very comfortable there.",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocJ6dzBSyLeutn58Tl7P4H2zNOcPz5_Ym-u6868fL2j-35oq5A=w47-h47-p-rp-mo-ba12-br100",
    image: "/full-size-logo.jpg",
  },
];

const duplicatedTestimonials = [...testimonials, ...testimonials];

const FUITestimonialWithSlide = () => {
  return (
    <div className="w-full mx-auto">
      <div
        className="flex relative overflow-hidden shrink-0 max-w-full"
        style={{
          maskImage:
            "linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)",
          WebkitMaskImage:
            "linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)",
        }}
      >
        <div className="flex animate-x-slider gap-5 w-max">
          {duplicatedTestimonials.map((testimonial, indx) => (
            <div
              key={indx}
              className="flex flex-col shrink-0 grow-0 w-[520px] h-full"
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            >
              {/* Quote */}
              <p
                className="px-6 py-6 text-pretty font-extralight tracking-tight"
                style={{
                  fontSize: "clamp(15px, 1.4vw, 20px)",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                &ldquo;{testimonial.description}.&rdquo;
              </p>

              {/* Footer */}
              <div
                className="w-full flex gap-1 overflow-hidden"
                style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
              >
                {/* Avatar + name */}
                <div className="flex gap-3 items-center px-4 py-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <div className="flex flex-col flex-1 gap-0 justify-start items-start">
                    <h5
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#ffffff",
                        lineHeight: 1.3,
                      }}
                    >
                      {testimonial.name}
                    </h5>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.4)",
                        marginTop: "1px",
                      }}
                    >
                      {testimonial.profession}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FUITestimonialWithSlide;
