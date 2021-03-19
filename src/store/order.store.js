import { stayService } from '../services/stay.service.js';
import { orderService } from '../services/order.service.js';

export const orderStore = {
  state: {
    allOrders: [],
    currStayOrders: [],
    orders: [],
    host: null,
    // currViewedStayId: null
  },
  getters: {
    orders(state) {
      return state.orders;
    },
    getAllOrders(state) {
      return state.allOrders
    },
    getCurrStayOrders(state) {
      return state.currStayOrders
    }
  },
  mutations: {
    setOrders(state, { orders }) {
      state.orders = orders;
    },
    setHost(state, { host }) {
      state.host = host;
    },
    setAllOrders(state, { allOrders }) {
      state.allOrders = allOrders;
    },
    setCurrStayOrders(state, { stayId }) {
      state.currStayOrders = state.allOrders.filter(order => {
        return (order.stay._id === stayId)
      });
    },
  },
  actions: {
    loadAllOrders(context, { stayId }) {
      try {
        return orderService.query()
          .then(allOrders => {
            context.commit({ type: 'setAllOrders', allOrders })
            context.commit({ type: 'setCurrStayOrders', stayId })
          })
      } catch (err) {
        console.log('orderStore: Error in loadOrders', err)
        throw err
      }
    },

    //////////Noa: I think the filtering here is not done correctly /////////////////////////////////////////////////
    // and it should compare the user._id to the order.buyer._id//////////////////////////////////////////////////////////
    async loadHostOrders({ commit, state }, { host }) {
      try {
        commit({ type: 'setHost', host })
        const stays = await stayService.query(host);
        const orders = await orderService.query();

        const myOrders = orders.filter(order => {
          return stays.find(stay => {
            return stay._id === order.stay._id;
          })
        })
        commit({ type: 'setOrders', orders: myOrders })
      } catch (err) {
        console.log('orderStore: Error in loadHostOrders', err)
        throw err
      }
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async updateOrderStatus({ dispatch, state }, { order }) {
      await orderService.save(order)
      dispatch({ type: "loadHostOrders", order });
    }
  },

}
