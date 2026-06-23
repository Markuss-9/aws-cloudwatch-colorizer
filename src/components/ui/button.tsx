import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'text' | 'rainbow';
  size?: 'default' | 'icon' | 'sm';
  color?: 'default' | 'on' | 'off' | 'warning';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      color = 'default',
      disabled,
      ...props
    },
    ref,
  ) => {
    const base =
      'inline-flex items-center justify-center font-cursive transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40';

    const variants: Record<string, string> = {
      default: 'bg-brand text-white hover:bg-brand-hover active:bg-brand-active',
      outline: 'border border-current bg-transparent hover:opacity-80',
      text: 'bg-transparent hover:opacity-80',
      rainbow: 'bg-transparent border border-solid',
    };

    const sizes: Record<string, string> = {
      default: 'h-9 px-4 rounded text-sm',
      icon: 'h-9 w-9 rounded',
      sm: 'h-7 px-2 rounded text-xs',
    };

    const colors: Record<string, string> = {
      default: '',
      on: 'bg-on text-black hover:bg-on-light active:bg-on-dark',
      off: 'bg-off text-black hover:bg-off-light active:bg-off-dark',
      warning: 'text-warning border-warning',
    };

    let variantClasses = variants[variant];
    if (variant === 'rainbow') {
      variantClasses =
        'bg-rainbow-btn text-transparent bg-clip-text border-0 hover:bg-rainbow-btn-light';
    }

    const colorClasses =
      color !== 'default' && variant !== 'rainbow' ? colors[color] : '';

    return (
      <button
        className={cn(
          base,
          variantClasses,
          sizes[size],
          colorClasses,
          className,
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
