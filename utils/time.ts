export const formatTime = (timeStr: string, timeFormat: string = '12') => {
  if (!timeStr || timeStr === '--:--') return timeStr;
  if (timeFormat === '24') return timeStr;
  
  const [hours, minutes] = timeStr.split(':');
  let h = parseInt(hours);
  const m = minutes;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m} ${ampm}`;
};
