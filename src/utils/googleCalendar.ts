import { CLINIC_INFO } from '../data/clinicData';

export const GOOGLE_CALENDAR_LIMACHE_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ12vacGiRcph6SKB6wP3P3KdVtfjcO-VLrVkykGXMA2Zqvxcw6Xklgv26pMTY4f_55KiZjD-PGp?gv=true';

export const GOOGLE_CALENDAR_VINA_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3bM_VZFAA5G8xGiownikAVwBJIaKm2J4HA1SXYuD-1ZMfhZ_rsIkR7pJLfN46cOtbSSAmvEsxJ?gv=true';

declare global {
  interface Window {
    calendar?: {
      schedulingButton?: {
        load: (config: {
          url: string;
          color: string;
          label: string;
          target: HTMLElement;
        }) => void;
      };
    };
  }
}

/**
 * Dispatches a global event to show the standard appointment confirmation modal.
 */
export function triggerConfirmationModal(details: {
  patientName: string;
  locationName: string;
  dateTime: string;
  serviceName?: string;
}): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('show-booking-confirmation', {
      detail: details,
    })
  );
}

export type SchedulingLocation = 'vina' | 'limache';

/**
 * Triggers the official Google Calendar Appointment Scheduling modal for a given location.
 * Configured with official Acupuntura del Valle branding, elimination of Google watermarks,
 * and appearance of the confirmation button ONLY after the appointment has been completed.
 */
export function openGoogleCalendar(location: SchedulingLocation = 'vina'): void {
  if (typeof document === 'undefined') return;

  const isVina = location === 'vina';
  const calendarUrl = isVina ? GOOGLE_CALENDAR_VINA_URL : GOOGLE_CALENDAR_LIMACHE_URL;
  const locationTitle = isVina ? 'Agendamiento - Sede Viña del Mar' : 'Agendamiento - Sede Limache';
  const locationLabel = isVina ? 'Sede Viña del Mar' : 'Sede Limache';
  const hoursNotice = isVina ? 'Martes y Jueves (15:00 a 20:00)' : 'Viernes y Sábados (09:00 a 19:00)';
  const addressNotice = isVina
    ? '🌿 Consulta Viña del Mar: Diecinueve de Junio 1571 (Martes y Jueves)'
    : '🌿 Consulta Limache: Condell 115 (Viernes y Sábados)';
  const buttonDoneText = isVina ? '✓ Ya agendé mi cita en Viña del Mar' : '✓ Ya agendé mi cita en Limache';

  // Prevent duplicate overlays
  const existingOverlay = document.querySelector('.hur54b');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Inject CSS rules and keyframes
  const styleId = 'gcal-clean-styles';
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `
      @keyframes gcalFadeScale {
        from {
          opacity: 0;
          transform: scale(0.96);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes gcalPulseGlow {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(45, 64, 43, 0.4);
        }
        50% {
          box-shadow: 0 0 0 6px rgba(45, 64, 43, 0);
        }
      }
      .gcal-clean-hide,
      img[src*="googleusercontent"],
      [aria-label*="María Ignacia"],
      [data-profile-photo],
      div:has(> img[src*="googleusercontent"]),
      img[src*="branding/productlogos/calendar"],
      img[src*="calendar_2026"],
      a[href*="calendar.google.com"],
      [aria-label="Google Calendar"],
      .gb_Ld, .gb_Kd, .gb_4, .gb_1c, .gb_5c {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }

      /* Corrección de desbordamiento, alto máximo y espacio inferior para visualización del botón azul */
      .gcal-iframe-viewport {
        overflow-y: auto !important;
        overflow-x: hidden !important;
        -webkit-overflow-scrolling: touch !important;
        max-height: 100% !important;
        padding-bottom: 32px !important;
        box-sizing: border-box !important;
      }
      @media (max-width: 640px) {
        .gcal-iframe-viewport {
          padding-bottom: 40px !important;
        }
      }

      /* Reorientación y alineación superior */
      #gcal-schedule-modal-overlay {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: flex-start !important;
        padding-top: 20px !important;
        overflow-y: auto !important;
      }
      .gcal-dialog-box {
        margin-top: 0 !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Create full-screen overlay with top alignment (justify-content: flex-start, padding-top: 20px)
  const overlay = document.createElement('div');
  overlay.id = 'gcal-schedule-modal-overlay';
  overlay.className = 'hur54b';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(20, 26, 18, 0.72)';
  overlay.style.backdropFilter = 'blur(4px)';
  overlay.style.padding = '20px 16px 24px';
  overlay.style.paddingTop = '20px';
  overlay.style.zIndex = '99999';
  overlay.style.boxSizing = 'border-box';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'flex-start';
  overlay.style.overflowY = 'auto';

  // Modal dialog container with margin-top: 0
  const dialogBox = document.createElement('div');
  dialogBox.className = 'gcal-dialog-box';
  dialogBox.style.width = '100%';
  dialogBox.style.maxWidth = '940px';
  dialogBox.style.height = '100%';
  dialogBox.style.maxHeight = 'calc(100vh - 36px)';
  dialogBox.style.marginTop = '0';
  dialogBox.style.backgroundColor = '#ffffff';
  dialogBox.style.borderRadius = '16px';
  dialogBox.style.overflow = 'hidden';
  dialogBox.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.35)';
  dialogBox.style.display = 'flex';
  dialogBox.style.flexDirection = 'column';
  dialogBox.style.position = 'relative';
  dialogBox.style.border = '1px solid #E5E3D8';

  // Top Bar: Replaces Google profile photo & "Vergara..." with official Logo.jpg & branding
  const headerBar = document.createElement('div');
  headerBar.style.display = 'flex';
  headerBar.style.alignItems = 'center';
  headerBar.style.justifyContent = 'space-between';
  headerBar.style.padding = '12px 20px';
  headerBar.style.backgroundColor = '#FAF9F5';
  headerBar.style.borderBottom = '1px solid #E5E3D8';
  headerBar.style.flexShrink = '0';

  // Left side of header: Official Logo + Title + Subtitle
  const headerBrand = document.createElement('div');
  headerBrand.style.display = 'flex';
  headerBrand.style.alignItems = 'center';
  headerBrand.style.gap = '12px';

  const logoImg = document.createElement('img');
  logoImg.src = '/Logo.jpg';
  logoImg.alt = 'Acupuntura del Valle';
  logoImg.onerror = () => {
    logoImg.src = CLINIC_INFO.logoUrl;
  };
  logoImg.style.width = '44px';
  logoImg.style.height = '44px';
  logoImg.style.borderRadius = '50%';
  logoImg.style.objectFit = 'cover';
  logoImg.style.border = '1.5px solid #BDCF9A';
  logoImg.style.backgroundColor = '#ffffff';
  logoImg.style.boxShadow = '0 2px 5px rgba(45,64,43,0.1)';
  logoImg.style.flexShrink = '0';

  const titleBlock = document.createElement('div');
  titleBlock.innerHTML = `
    <div style="font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 16px; color: #2D402B; line-height: 1.2;">
      Acupuntura del Valle
    </div>
    <div style="font-size: 11px; color: #56642B; font-weight: 500; margin-top: 2px;">
      ${locationLabel} · ${hoursNotice}
    </div>
  `;

  headerBrand.appendChild(logoImg);
  headerBrand.appendChild(titleBlock);

  // Close button (Top Right)
  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Cerrar ventana de agendamiento');
  closeBtn.style.display = 'inline-flex';
  closeBtn.style.alignItems = 'center';
  closeBtn.style.justifyContent = 'center';
  closeBtn.style.gap = '6px';
  closeBtn.style.backgroundColor = '#2D402B';
  closeBtn.style.color = '#ffffff';
  closeBtn.style.border = 'none';
  closeBtn.style.borderRadius = '8px';
  closeBtn.style.padding = '7px 14px';
  closeBtn.style.fontSize = '12px';
  closeBtn.style.fontWeight = '600';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.transition = 'background-color 0.2s ease, transform 0.1s ease';
  closeBtn.innerHTML = '<span>✕</span><span>Cerrar</span>';

  closeBtn.onmouseenter = () => {
    closeBtn.style.backgroundColor = '#1D2A1C';
  };
  closeBtn.onmouseleave = () => {
    closeBtn.style.backgroundColor = '#2D402B';
  };

  headerBar.appendChild(headerBrand);
  headerBar.appendChild(closeBtn);

  // Iframe Container with overflow-y:auto, max-height and bottom padding
  // Clips out Google Calendar's native header (avatar circle, organizer name)
  // while ensuring the internal booking form and blue confirmation button ("Reservar" / "Confirmar cita")
  // are 100% visible, accessible via scroll, and never cut off at the bottom.
  const iframeContainer = document.createElement('div');
  iframeContainer.className = 'gcal-iframe-viewport';
  iframeContainer.style.position = 'relative';
  iframeContainer.style.width = '100%';
  iframeContainer.style.flex = '1 1 auto';
  iframeContainer.style.overflowY = 'auto';
  iframeContainer.style.overflowX = 'hidden';
  iframeContainer.style.maxHeight = '100%';
  iframeContainer.style.paddingBottom = '32px';
  iframeContainer.style.boxSizing = 'border-box';
  iframeContainer.style.backgroundColor = '#ffffff';

  // Sub-header guidance bar positioned over top of iframe
  const guidanceBar = document.createElement('div');
  guidanceBar.style.position = 'sticky';
  guidanceBar.style.top = '0';
  guidanceBar.style.left = '0';
  guidanceBar.style.right = '0';
  guidanceBar.style.zIndex = '5';
  guidanceBar.style.backgroundColor = '#FAF9F5';
  guidanceBar.style.padding = '6px 18px';
  guidanceBar.style.borderBottom = '1px solid #EBE9DF';
  guidanceBar.style.display = 'flex';
  guidanceBar.style.alignItems = 'center';
  guidanceBar.style.justifyContent = 'space-between';
  guidanceBar.style.fontSize = '11px';
  guidanceBar.style.color = '#4A5B20';
  guidanceBar.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:6px;">
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background-color:#4A5B20;"></span>
        <label for="gcal-modal-service-select" style="font-weight:600;color:#2D3618;font-size:11px;">Servicio:</label>
      </div>
      <select id="gcal-modal-service-select" aria-label="Servicio de atención" style="padding:3px 10px;font-size:11px;border-radius:6px;border:1px solid #CFCDBF;background:#FFFFFF;color:#2D3618;font-weight:600;cursor:pointer;outline:none;">
        <option value="Acupuntura">Acupuntura ($25.000 · 60 min)</option>
        <option value="Acupuntura Estética">Acupuntura Estética ($35.000 · 90 min)</option>
        <option value="Auriculoterapia">Auriculoterapia ($15.000 · 30 min)</option>
        <option value="Ventosas">Ventosas ($15.000 · 30 min)</option>
        <option value="Masaje Facial Japonés">Masaje Facial Japonés ($30.000 · 45 min)</option>
      </select>
    </div>
    <span style="color:#7A7C6E;font-size:10px;">Sesiones de 60 min · Acreditada en Medicina China</span>
  `;

  // Embedded iframe with official Google Calendar scheduling page
  // Shifting marginTop by -78px pushes the Google avatar circle & "Vergara..." completely out of view
  // Height and minHeight ensure the internal booking form and blue button "Reservar" have complete vertical space
  const iframe = document.createElement('iframe');
  iframe.title = locationTitle;
  iframe.className = 'mmGMM gcal-iframe-clean';
  iframe.src = calendarUrl;
  iframe.style.width = '100%';
  iframe.style.height = 'calc(100% + 78px)';
  iframe.style.minHeight = '720px';
  iframe.style.marginTop = '-78px';
  iframe.style.border = 'none';
  iframe.style.display = 'block';
  iframe.style.backgroundColor = '#ffffff';
  iframe.setAttribute(
    'sandbox',
    'allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-storage-access-by-user-activation'
  );

  // Confirmation Floating Promo Mask:
  // Completely covers and eliminates the floating card:
  // "Google Calendar - Crea tu propia página de citas - Más información"
  // when the user is on the "Reserva confirmada" screen.
  const confirmationPromoMask = document.createElement('div');
  confirmationPromoMask.style.position = 'absolute';
  confirmationPromoMask.style.bottom = '0';
  confirmationPromoMask.style.left = '0';
  confirmationPromoMask.style.right = '0';
  confirmationPromoMask.style.height = '94px';
  confirmationPromoMask.style.backgroundColor = '#FFFFFF';
  confirmationPromoMask.style.borderTop = '1px solid #E5E3D8';
  confirmationPromoMask.style.zIndex = '25';
  confirmationPromoMask.style.display = 'none'; // Only appears upon confirmation
  confirmationPromoMask.style.alignItems = 'center';
  confirmationPromoMask.style.justifyContent = 'space-between';
  confirmationPromoMask.style.padding = '12px 20px';
  confirmationPromoMask.style.boxShadow = '0 -4px 14px rgba(0,0,0,0.06)';
  confirmationPromoMask.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="width:36px;height:36px;border-radius:50%;background:#EDF4E2;border:1.5px solid #BDCF9A;display:flex;align-items:center;justify-content:center;color:#2D402B;font-weight:bold;font-size:16px;flex-shrink:0;">
        ✓
      </div>
      <div>
        <div style="font-weight:700;font-size:13px;color:#2D402B;">
          ¡Cita Registrada en Acupuntura del Valle!
        </div>
        <div style="font-size:11px;color:#6A6C5D;margin-top:2px;">
          Haz clic a la derecha en <strong>"${buttonDoneText}"</strong> para ver tu comprobante oficial y enviar recordatorio.
        </div>
      </div>
    </div>
  `;

  // Bottom action bar
  const footerBar = document.createElement('div');
  footerBar.style.display = 'flex';
  footerBar.style.alignItems = 'center';
  footerBar.style.justifyContent = 'space-between';
  footerBar.style.padding = '10px 18px';
  footerBar.style.backgroundColor = '#FAF9F5';
  footerBar.style.borderTop = '1px solid #E5E3D8';
  footerBar.style.flexWrap = 'wrap';
  footerBar.style.gap = '8px';
  footerBar.style.zIndex = '30';

  const footerInfo = document.createElement('div');
  footerInfo.style.fontSize = '11px';
  footerInfo.style.color = '#56642B';
  footerInfo.style.fontWeight = '500';
  footerInfo.innerHTML = `<span>${addressNotice}</span>`;

  // Secondary helper prompt shown before confirmation
  const manualTriggerHelper = document.createElement('button');
  manualTriggerHelper.type = 'button';
  manualTriggerHelper.style.background = 'none';
  manualTriggerHelper.style.border = 'none';
  manualTriggerHelper.style.color = '#6A6C5D';
  manualTriggerHelper.style.fontSize = '11px';
  manualTriggerHelper.style.textDecoration = 'underline';
  manualTriggerHelper.style.cursor = 'pointer';
  manualTriggerHelper.style.padding = '4px 6px';
  manualTriggerHelper.style.display = 'inline-block';
  manualTriggerHelper.innerHTML = '¿Ya completaste tu cita? Haz clic aquí';

  // Green button: "✓ Ya agendé mi cita en Viña del Mar / Limache"
  // Oculto por defecto; aparece ÚNICAMENTE al completar con éxito la reserva
  const confirmDoneBtn = document.createElement('button');
  confirmDoneBtn.type = 'button';
  confirmDoneBtn.id = `btn-terminar-agendamiento-${location}`;
  confirmDoneBtn.style.padding = '8px 18px';
  confirmDoneBtn.style.backgroundColor = '#2D402B';
  confirmDoneBtn.style.color = '#ffffff';
  confirmDoneBtn.style.border = 'none';
  confirmDoneBtn.style.borderRadius = '9px';
  confirmDoneBtn.style.fontSize = '12px';
  confirmDoneBtn.style.fontWeight = '700';
  confirmDoneBtn.style.cursor = 'pointer';
  confirmDoneBtn.style.transition = 'all 0.2s ease';
  confirmDoneBtn.style.display = 'none'; // Oculto por defecto como solicitado
  confirmDoneBtn.innerHTML = `<span>${buttonDoneText}</span>`;

  confirmDoneBtn.onmouseenter = () => {
    confirmDoneBtn.style.backgroundColor = '#1D2A1C';
    confirmDoneBtn.style.transform = 'translateY(-1px)';
  };
  confirmDoneBtn.onmouseleave = () => {
    confirmDoneBtn.style.backgroundColor = '#2D402B';
    confirmDoneBtn.style.transform = 'translateY(0)';
  };

  let hasConfirmed = false;

  // Reveal confirmation state: shows the green button and masks Google floating promo card
  const showConfirmationState = () => {
    if (hasConfirmed) return;
    hasConfirmed = true;

    // Reorientación y alineación superior:
    // Elimina el margen superior/desplazamiento negativo (margin-top: 0)
    // para que la tarjeta de "Reserva confirmada" (con su ícono de verificación azul
    // y el texto "Acupuntura del Valle") suba dentro del área visible y no quede cortada en la parte superior.
    iframe.style.marginTop = '0';
    iframe.style.height = '100%';
    dialogBox.style.marginTop = '0';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'flex-start';
    overlay.style.paddingTop = '20px';

    // Auto-scroll al confirmar:
    // Desplazamiento automático hacia el borde superior (scrollTop = 0 / scrollIntoView({ block: 'start' }))
    iframeContainer.scrollTop = 0;
    try {
      iframeContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      iframeContainer.scrollTop = 0;
    }

    try {
      dialogBox.scrollTop = 0;
      overlay.scrollTop = 0;
      iframeContainer.scrollIntoView({ block: 'start', behavior: 'smooth' });
    } catch {
      // Fallback
    }

    // Hide guidance bar so it doesn't take space above the confirmation card
    if (guidanceBar) {
      guidanceBar.style.display = 'none';
    }

    // Show mask over Google Calendar's floating promo card
    confirmationPromoMask.style.display = 'flex';

    // Hide manual trigger helper
    manualTriggerHelper.style.display = 'none';

    // Make the green button visible with smooth entrance animation and pulse
    confirmDoneBtn.style.display = 'inline-flex';
    confirmDoneBtn.style.animation = 'gcalFadeScale 0.3s ease-out forwards, gcalPulseGlow 2s infinite ease-in-out';

    // Update footer info
    footerInfo.innerHTML = `<span style="color:#2D402B;font-weight:600;">🎉 ¡Reserva confirmada en pantalla! Haz clic en el botón verde para continuar.</span>`;
  };

  manualTriggerHelper.onclick = () => {
    showConfirmationState();
  };

  confirmDoneBtn.onclick = () => {
    cleanup();
    triggerConfirmationModal({
      patientName: 'Paciente',
      locationName: locationLabel,
      dateTime: 'Horario confirmado en Google Calendar',
    });
  };

  footerBar.appendChild(footerInfo);
  footerBar.appendChild(manualTriggerHelper);
  footerBar.appendChild(confirmDoneBtn);

  const cleanup = () => {
    document.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('message', handleMessage);
    overlay.remove();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      cleanup();
    }
  };

  // Listen for Google Calendar postMessage notifications
  const handleMessage = (e: MessageEvent) => {
    try {
      let isBookingEvent = false;

      if (typeof e.data === 'string') {
        const lower = e.data.toLowerCase();
        if (
          lower.includes('appointment') ||
          lower.includes('booked') ||
          lower.includes('confirmed') ||
          lower.includes('schedule') ||
          lower.includes('reserva') ||
          lower.includes('cita') ||
          lower.includes('success')
        ) {
          isBookingEvent = true;
        }
      } else if (e.data && typeof e.data === 'object') {
        const jsonStr = JSON.stringify(e.data).toLowerCase();
        if (
          jsonStr.includes('appointment') ||
          jsonStr.includes('booked') ||
          jsonStr.includes('confirmed') ||
          jsonStr.includes('schedule') ||
          jsonStr.includes('reserva') ||
          jsonStr.includes('cita') ||
          jsonStr.includes('success')
        ) {
          isBookingEvent = true;
        }
      }

      if (isBookingEvent) {
        showConfirmationState();
      }
    } catch {
      // Ignore cross-origin JSON issues
    }
  };

  closeBtn.onclick = cleanup;
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      cleanup();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  window.addEventListener('message', handleMessage);

  iframeContainer.appendChild(guidanceBar);
  iframeContainer.appendChild(iframe);
  iframeContainer.appendChild(confirmationPromoMask);

  dialogBox.appendChild(headerBar);
  dialogBox.appendChild(iframeContainer);
  dialogBox.appendChild(footerBar);
  overlay.appendChild(dialogBox);
  document.body.appendChild(overlay);

  // Track iframe load cycles: when form is submitted, loadCount >= 2
  let loadCount = 0;
  iframe.onload = () => {
    loadCount++;
    if (loadCount >= 2) {
      showConfirmationState();
    }
  };
}

/**
 * Triggers the official Google Calendar Appointment Scheduling modal for Viña del Mar.
 */
export function openGoogleCalendarVina(): void {
  openGoogleCalendar('vina');
}

/**
 * Triggers the official Google Calendar Appointment Scheduling modal for Limache.
 */
export function openGoogleCalendarLimache(): void {
  openGoogleCalendar('limache');
}

