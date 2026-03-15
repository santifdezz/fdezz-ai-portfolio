/**
 * Calculate months and years between two dates
 */
export function calculateMonthsYears(startDate: Date, endDate: Date = new Date()): {
  months: number;
  years: number;
  display: string; // e.g., "5 months" or "1 year, 3 months"
} {
  let months = 0;
  let years = 0;

  // Calculate years
  years = endDate.getFullYear() - startDate.getFullYear();
  let tempMonth = endDate.getMonth() - startDate.getMonth();

  if (tempMonth < 0) {
    years--;
    tempMonth += 12;
  }
  months = tempMonth;

  // Generate display string
  let display = "";
  if (years > 0) {
    display += `${years} year${years > 1 ? "s" : ""}`;
    if (months > 0) display += `, ${months} month${months > 1 ? "s" : ""}`;
  } else {
    display = `${months} month${months > 1 ? "s" : ""}`;
  }

  return {
    months: years * 12 + months,
    years,
    display,
  };
}

/**
 * Get experience display string in Spanish or English
 */
export function getExperienceDisplay(startDate: Date, locale: string = "en"): string {
  const { years, display } = calculateMonthsYears(startDate);

  if (locale === "es") {
    const parts = display.split(", ");
    let esDisplay = "";

    for (const part of parts) {
      if (part.includes("year")) {
        const num = parseInt(part);
        esDisplay += `${num} año${num > 1 ? "s" : ""}`;
      } else if (part.includes("month")) {
        const num = parseInt(part);
        esDisplay += (esDisplay ? ", " : "") + `${num} mes${num > 1 ? "es" : ""}`;
      }
    }
    return esDisplay;
  }

  return display;
}
