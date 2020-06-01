import React, { Component } from 'react'
import Aux from '../../hoc/Hoc/Wrapper'
import Burger from '../../components/Burger/Burger';
import BurguerControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner'
import withOrderHandler from '../../hoc/withErrorHandler/WithOrderHandler'
import { connect } from 'react-redux'
import * as burgerBulderActions from '../../stores/actions/index'
import axios from '../../axios-orders'

const mapStateToProps = (state) => {
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice,
        error: state.error
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        onIngredientAdd: (ingredientName) => dispatch(burgerBulderActions.addIngredient(ingredientName)),
        onIngredientRemove: (ingredientName) => dispatch(burgerBulderActions.removeIngredient(ingredientName)),
        onFetchIngredients: () => dispatch(burgerBulderActions.fetchIngredients())
    }
}

class BurguerBuilder extends Component {

    state = {
        showOrderModal: false
    }

    componentDidMount(){
        this.props.onFetchIngredients()
    }
    

    getIngredientsAmount = (type) => this.props.ingredients[type] ? this.props.ingredients[type] : 0

    isPurchasable = () =>  Object.values(this.props.ingredients).reduce((curr, next) => curr + next, 0) > 0

    onRemoveHandler = (type) => {
        this.props.onIngredientRemove(type)
    }

    onAddHanlder = (type) => {
        this.props.onIngredientAdd(type)
    }
    onOrderHandler = () => {
        this.setState({ showOrderModal: true })
    }

    onHideOrderModal = () => {
        this.setState({ showOrderModal: false })
    }

    purchaseContinueHandler = () => {        
        // Push a new page in stack of pages

        this.props.history.push(
            { pathname: "/checkout",
            ingredients: this.props.ingredients,
            totalPrice: this.props.totalPrice.toFixed(2) })
    }

    render() {
        const disabledIngredients = { ...this.props.ingredients }
        for (const key in disabledIngredients) { disabledIngredients[key] = disabledIngredients[key] <= 0 }
        return (
            <Aux>
                {this.props.error ? <p> There was an error</p>:
                    <Aux>
                        <Modal backdropHanlder={this.onHideOrderModal} show={this.state.showOrderModal}>
                            {!this.props.ingredients ? <Spinner /> :
                                (
                                    <OrderSummary
                                        ingredients={this.props.ingredients ? this.props.ingredients : {}}
                                        onCancel={this.onHideOrderModal}
                                        onContinue={this.purchaseContinueHandler}
                                    />)}
                        </Modal>
                {
                            this.props.ingredients ?
                                <Aux>
                                    <Burger ingredients={this.props.ingredients} />
                                    <BurguerControls
                                        added={this.onAddHanlder}
                                        removed={this.onRemoveHandler}
                                        price={this.props.totalPrice}
                                        disabled={disabledIngredients}
                                        purchasable={this.isPurchasable()}
                                        onOrderHandler={() => this.onOrderHandler()}
                                    />
                                </Aux> :
                                <Spinner />
                        }
                    </Aux>
                }
            </Aux>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withOrderHandler(BurguerBuilder, axios))