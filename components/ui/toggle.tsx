import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Styled toggle root based on project button conventions
const toggleVariants = cva(
	"inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:shadow-sm",
	{
		variants: {
			variant: {
				primary:
					"bg-muted text-muted-background data-[state=on]:bg-primary data-[state=on]:text-white hover:bg-muted/80 data-[state=on]:hover:bg-primary/90",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90",
				ghost:
					"hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90",
			},
			size: {
				sm: "h-8 px-3",
				default: "h-9 px-3",
				lg: "h-10 px-4 text-base",
				icon: "h-9 w-9", // icon only
			},
			pill: {
				true: "rounded-md",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	}
)

export interface ToggleProps
	extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
		VariantProps<typeof toggleVariants> {
	/**
	 * Provide a function or string for dynamic labeling.
	 * If a function is provided it receives the current on state and should return a React node.
	 */
	label?: string | ((on: boolean) => React.ReactNode)
	/** Optional icon to show before label */
	leadingIcon?: React.ReactNode
	/** Optional icon to show after label */
	trailingIcon?: React.ReactNode
	/** When true hides the visual label for a11y (still announced via aria-label) */
	visuallyHiddenLabel?: boolean
	/** Explicit aria-label override (otherwise derived from label prop) */
	ariaLabel?: string
}

export const Toggle = React.forwardRef<
	React.ElementRef<typeof TogglePrimitive.Root>,
	ToggleProps
>(
	(
		{
			className,
			variant,
			size,
			pill,
			label,
			leadingIcon,
			trailingIcon,
			visuallyHiddenLabel = false,
			ariaLabel,
			children,
			...props
		},
		ref
	) => {
		const [on, setOn] = React.useState<boolean>(!!props.defaultPressed || !!props.pressed)

		// Keep internal state in sync when controlled
		React.useEffect(() => {
			if (typeof props.pressed === "boolean") {
				setOn(props.pressed)
			}
		}, [props.pressed])

		const renderedLabel =
			typeof label === "function" ? label(on) : label ?? children

		const ariaLabelValue =
			ariaLabel ||
			(typeof label === "string"
				? label
				: typeof renderedLabel === "string"
				? renderedLabel
				: undefined)

		return (
			<TogglePrimitive.Root
				ref={ref}
				className={cn(toggleVariants({ variant, size, pill, className }))}
				pressed={props.pressed}
				defaultPressed={props.defaultPressed}
				onPressedChange={(state) => {
					setOn(state)
					props.onPressedChange?.(state)
				}}
				aria-label={ariaLabelValue}
				{...props}
			>
				{leadingIcon ? <span className="flex shrink-0 items-center">{leadingIcon}</span> : null}
				{renderedLabel && !visuallyHiddenLabel ? (
					<span className="select-none">{renderedLabel}</span>
				) : null}
				{visuallyHiddenLabel && ariaLabelValue ? (
						<span className="sr-only">{ariaLabelValue}</span>
				) : null}
				{trailingIcon ? <span className="flex shrink-0 items-center">{trailingIcon}</span> : null}
			</TogglePrimitive.Root>
		)
	}
)
Toggle.displayName = "Toggle"

// Convenience specialized component for a labeled primary toggle that swaps label text
export interface LabeledPrimaryToggleProps extends Omit<ToggleProps, "variant" | "label"> {
	onLabel?: React.ReactNode
	offLabel?: React.ReactNode
}

export const LabeledPrimaryToggle: React.FC<LabeledPrimaryToggleProps> = ({
	onLabel = "On",
	offLabel = "Off",
	...rest
}) => {
	return (
		<Toggle
			variant="primary"
		label={(isOn: boolean) => (isOn ? onLabel : offLabel)}
			{...rest}
		/>
	)
}

export { toggleVariants }

