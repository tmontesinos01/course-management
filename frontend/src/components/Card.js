export const Card = ({ children, className = '' }) => {
  return `
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm ${className}">
      ${children}
    </div>
  `;
};

export const CardHeader = ({ children, className = '' }) => {
  return `
    <div class="flex flex-col space-y-1.5 p-6 ${className}">
      ${children}
    </div>
  `;
};

export const CardTitle = ({ children, className = '' }) => {
  return `
    <h3 class="text-2xl font-semibold leading-none tracking-tight ${className}">
      ${children}
    </h3>
  `;
};

export const CardDescription = ({ children, className = '' }) => {
  return `
    <p class="text-sm text-muted-foreground ${className}">
      ${children}
    </p>
  `;
};

export const CardContent = ({ children, className = '' }) => {
  return `
    <div class="p-6 pt-0 ${className}">
      ${children}
    </div>
  `;
};

export const CardFooter = ({ children, className = '' }) => {
  return `
    <div class="flex items-center p-6 pt-0 ${className}">
      ${children}
    </div>
  `;
};

export const card = Card;
