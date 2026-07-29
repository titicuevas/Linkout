const SWAL_DEFAULTS = {
  background: '#18181b',
  color: '#fff',
  confirmButtonColor: '#6366f1',
};

export function swalSuccess(title, text, extra = {}) {
  return { icon: 'success', title, text, ...SWAL_DEFAULTS, ...extra };
}

export function swalError(title, text, extra = {}) {
  return { icon: 'error', title, text, confirmButtonText: 'Aceptar', ...SWAL_DEFAULTS, ...extra };
}

export function swalWarning(title, text, extra = {}) {
  return {
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar',
    ...SWAL_DEFAULTS,
    cancelButtonColor: '#d33',
    ...extra,
  };
}

export function swalInfo(title, text, extra = {}) {
  return { icon: 'info', title, text, ...SWAL_DEFAULTS, ...extra };
}
