type Props = {
  steps: string[];
  current: number;
};

export default function CheckoutSteps({ steps, current }: Props) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <div key={step} className="flex-1 text-center">
          <div
            className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${
              index <= current
                ? "bg-orange-500 text-white"
                : "bg-(--surface-secondary) text-(--foreground-secondary) border border-(--border)"
            }`}
          >
            {index + 1}
          </div>

          <p className="mt-2 text-sm text-(--foreground)">{step}</p>
        </div>
      ))}
    </div>
  );
}
