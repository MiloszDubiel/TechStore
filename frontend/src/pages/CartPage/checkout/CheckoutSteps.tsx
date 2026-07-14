type Props = {
  steps: string[];
  current: number;
};

export default function CheckoutSteps({ steps, current }: Props) {
  return (
    <div className=" flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step} className=" flex-1 text-center">
          <div
            className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center ${
              index <= current ? "bg-orange-500 text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </div>

          <p className="mt-2 text-sm">{step}</p>
        </div>
      ))}
    </div>
  );
}
