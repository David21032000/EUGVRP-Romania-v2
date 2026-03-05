export default {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`${client.user.tag} este online!`);
  },
};