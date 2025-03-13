import { Card, CardContent } from "@/components/ui/card";
import { WhyChooseUsSectionData } from "@/data/home";
import Image from "next/image";

export default function WhyChooseUsSection() {
  return (
    <section className="py-12 bg-primary-lighter relative overflow-hidden">
      <div className="absolute inset-0 bg-leaf-pattern opacity-10"></div>
      <div className="container relative">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-12 text-center">
          {WhyChooseUsSectionData.title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WhyChooseUsSectionData.cards.map((card, index) => (
            <Card className="bg-white border-none shadow-md" key={index}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="rounded-full bg-primary-light p-3 w-fit h-fit flex items-center justify-center mb-3 ">
                    <Image
                      src={card.icon}
                      alt={card.title}
                      className="icon-white"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-600">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
//Component cho phần tại sao chọn nông sàn.
