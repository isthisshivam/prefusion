import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Utility from '../../utility/Utility';
import api from '../../constants/api';
export const commonFoodDetails = async (userData, food_name) => {
  console.log('commonFoodDetails.payload==', food_name);
  const headers = new Headers({
    'Content-Type': 'application/json',
    'x-user-jwt': userData && userData.nutritionix_user_jwt,
    'x-app-id': userData && userData.nutrition_app_id,
    'x-app-key': userData && userData.nutrition_app_key,
  });
  return await fetch(api.GET_FOOD_DETAILS_NUTRIENTS, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      query: food_name,
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('GET_FOOD_DETAILS_NUTRIENTS===', JSON.stringify(data));

      if (data?.foods) {
        return data?.foods[0];
      }
    })
    .catch(e => {
      return e;
    });
};
export const brandedFoodDetails = async (userData, food_id) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'x-user-jwt': userData && userData.nutritionix_user_jwt,
    'x-app-id': userData && userData.nutrition_app_id,
    'x-app-key': userData && userData.nutrition_app_key,
  });
  return await fetch(api.GET_FOOD_DETAILS + food_id, {
    method: 'GET',
    headers: headers,
  })
    .then(response => response.json())
    .then(data => {
      console.log('onPlusPress.resp===', JSON.stringify(data));

      if (data?.foods) {
        return data?.foods[0];
      } else {
      }
    })
    .catch(e => {
      return e;
    });
};
