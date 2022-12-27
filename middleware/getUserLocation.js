const getUserLocation = (req) => {
  const { role, roleId } = req.user;

  if (role == "district") {
    const res = roleId.split("-");
    return { province: res[0], district: res[1] };
  }
  if (role == "sector") {
    const res = roleId.split("-");
    return { province: res[0], district: res[1], sector: res[2] };
  }
  if (role == "cell") {
    const res = roleId.split("-");
    return {
      province: res[0],
      district: res[1],
      sector: res[2],
      cell: res[3],
    };
  }
  if (role == "village") {
    const res = roleId.split("-");
    return {
      province: res[0],
      district: res[1],
      sector: res[2],
      cell: res[3],
      village: res[4],
    };
  }
  return {};
};

module.exports = getUserLocation;
