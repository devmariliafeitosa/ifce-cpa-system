function formatarFormResponse(form) {
  return {
    id: form.id,
    title: form.title,
    description: form.description,
    campusId: form.campusId,
    startDate: form.startDate,
    endDate: form.endDate,
    startTime: form.startTime,
    endTime: form.endTime,
    status: form.status,
    isAtivo: form.isAtivo,
    createdBy: form.createdBy,
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
  };
}

module.exports = { formatarFormResponse };