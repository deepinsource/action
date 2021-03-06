exports.up = async (r) => {
  try {
    await r.tableCreate('TeamInvitation')
  } catch (e) {
    // noop
  }
  try {
    await r({
      token: r.table('TeamInvitation').indexCreate('token'),
      email: r.table('TeamInvitation').indexCreate('email'),
      teamId: r.table('TeamInvitation').indexCreate('teamId')
    })
  } catch (e) {}
}

exports.down = async (r) => {
  try {
    await r.tableDrop('TeamInvitation')
  } catch (e) {
    // noop
  }
}
