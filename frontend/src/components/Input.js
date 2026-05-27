import { icon } from './Icons.js';

export const Input = ({
  type = 'text',
  placeholder = '',
  value = '',
  name = '',
  id = '',
  disabled = false,
  required = false,
  className = '',
  icon: iconName = null,
  ...props
}) => {
  const baseClasses = 'flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const inputHtml = `
    <input
      type="${type}"
      ${name ? `name="${name}"` : ''}
      ${id ? `id="${id}"` : ''}
      ${placeholder ? `placeholder="${placeholder}"` : ''}
      ${value ? `value="${value}"` : ''}
      ${disabled ? 'disabled' : ''}
      ${required ? 'required' : ''}
      class="${baseClasses} ${iconName ? 'pl-10' : ''} ${className}"
      ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(' ')}
    />
  `;
  
  if (iconName) {
    return `
      <div class="relative">
        <div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          ${icon(iconName)}
        </div>
        ${inputHtml}
      </div>
    `;
  }
  
  return inputHtml;
};

export const Label = ({ children, htmlFor = '', className = '', required = false }) => {
  return `
    <label 
      ${htmlFor ? `for="${htmlFor}"` : ''}
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}"
    >
      ${children}${required ? '<span class="text-destructive ml-1">*</span>' : ''}
    </label>
  `;
};

export const FormGroup = ({ children, className = '' }) => {
  return `
    <div class="space-y-2 ${className}">
      ${children}
    </div>
  `;
};

export const Textarea = ({
  placeholder = '',
  value = '',
  name = '',
  id = '',
  rows = 3,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return `
    <textarea
      ${name ? `name="${name}"` : ''}
      ${id ? `id="${id}"` : ''}
      ${placeholder ? `placeholder="${placeholder}"` : ''}
      rows="${rows}"
      ${disabled ? 'disabled' : ''}
      ${required ? 'required' : ''}
      class="flex min-h-[80px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}"
      ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(' ')}
    >${value}</textarea>
  `;
};

export const Select = ({
  options = [],
  value = '',
  name = '',
  id = '',
  placeholder = 'Seleccione...',
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const optionsHtml = [
    `<option value="">${placeholder}</option>`,
    ...options.map(opt => `
      <option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>
        ${opt.label}
      </option>
    `)
  ].join('');
  
  return `
    <select
      ${name ? `name="${name}"` : ''}
      ${id ? `id="${id}"` : ''}
      ${disabled ? 'disabled' : ''}
      ${required ? 'required' : ''}
      class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}"
      ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(' ')}
    >
      ${optionsHtml}
    </select>
  `;
};

export const Checkbox = ({
  name = '',
  id = '',
  checked = false,
  disabled = false,
  className = '',
  label = '',
  ...props
}) => {
  return `
    <div class="flex items-center space-x-2">
      <input
        type="checkbox"
        ${name ? `name="${name}"` : ''}
        ${id ? `id="${id}"` : ''}
        ${checked ? 'checked' : ''}
        ${disabled ? 'disabled' : ''}
        class="h-4 w-4 rounded border-border text-primary focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}"
        ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(' ')}
      />
      ${label ? `<label for="${id}" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">${label}</label>` : ''}
    </div>
  `;
};

export const input = Input;
export const label = Label;
export const formGroup = FormGroup;
export const textarea = Textarea;
export const select = Select;
export const checkbox = Checkbox;
