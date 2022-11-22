import { CartService } from './../_services/cart.service';
import { UserService } from './../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Stripe } from '@ionic-native/stripe/ngx';
import { Product } from '../models/cart.model';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  cardinfo: any = {
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  };
  carts: Product[] = [];

  constructor(
    private stripe: Stripe,
    private alertCtrl: AlertController,
    public http: HttpClient,
    private userService: UserService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.carts = this.cartService.getCart();
  }

  pay() {
    if (this.carts.length <= 0) return;
    this.stripe.setPublishableKey(
      'pk_test_51M40w0Kdn20iZFTQlBojlYh3z9CnRnI1KwfoDtAkjTpZk2Bk7bbTPZWy3dFLMbG5oFBSaWyNXgsSkp4JU1Eykka5003A8d7qli'
    );
    this.stripe.createCardToken(this.cardinfo).then((token) => {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      let paydata = {
        token: token.id,
        currency: 'USD',
        amount: this.calculateTotalPrice(this.carts),
        description: 'test payment',
      };

      let url =
        'http://localhost:5001/shopping-cart-bfc72/us-central1/payWithStripe';

      this.http.post(url, paydata, { headers: headers }).subscribe((res) => {
        if (res) {
          console.log('res :>> ', res);
          this.userService.saveInvoicesStripe(res);
          const alert = this.alertCtrl.create({
            header: 'Order Success',
            message: 'We will deliver your order soon',
            buttons: ['OK'],
          });
        }
      });
    });
  }

  calculateTotalPrice(carts: Product[]): number {
    let result = 0;
    for (let item of carts) {
      result += item.price * item.qty;
    }

    return result;
  }
}
