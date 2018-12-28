export default {
    display: 'hidden', // full, mini, hidden
    view: 2, // -1: other-profile, 0: profile, 1: comment, 2: chat, 3: inbox, 4: followers
    chatTopPanel: 0, // 0: nothing, 1: current page users, 2: invitations
	// width/height must always be interger rather than string!
	// Otherwise reisze will fail during calculation
    width: 280,
    height: 350,
    left: 10,
    shwModal: false,
}
