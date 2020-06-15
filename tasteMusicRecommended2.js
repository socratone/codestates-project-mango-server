/*eslint-disable*/
// 피어슨 상관계수 계산
// 유사도를 계산하면 계-1 ~ 1까지의 값이 나온다.
// 완전히 동일할수록 1에 가까워지고 완전히 다를수록 -1에 가까워진다. 
var dataset = {
  'Lee' : {
    'Believer' : 4,
    'Dali,Van,Picasso' : 4,
    '소주한잔' : 3.5,
    'Where is the love?' : 4.5,
    '수취인불명' : 4
  },
  'Kim' : {
    'Believer' : 2,
    '소주한잔' : 5,
    '마시멜로우' : 5,
    '수취인불명' : 3,
    'Where is the love?' : 2
  },
  'Park' : {
    'Dali,van,Picasso' : 5,
    '소주한잔' : 5,
    'Where is the love?' : 2,
    '수취인불명' : 4,
    '기억의 습작' : 5
  },
  'Oh' : {
    'Believer' : 2,
    '소주한잔' : 1,
    '수취인불명' : 3,
    '좋은 날' : 4,
    'Aqua man' : 5
  },
  'Choi' : {
    'Believer' : 4,
    'Dali,Van,Picasso' : 4,
    '소주한잔' : 3.5,
    'Where is the love?' : 4.5,
    'It is my life' : 5,
    '목요일 밤' : 4.5,
    '비행기' : 4
  }
};

var pearson_correlation = function(dataset,p1,p2){
  var existp1p2 = {};
  for(item in dataset[p1]){
    if(item in dataset[p2]){
      existp1p2[item] = 1;
    }
  }
  var num_existence = len(existp1p2);
  if(num_existence ==0) return 0; 
  var p1_sum=0, // p1과 p2의 합과 제곱근의 합을 저장한다.
    p2_sum=0,
    p1_sq_sum=0,
    p2_sq_sum=0,
    prod_p1p2 = 0;
  for(var item in existp1p2){ // 각 데이터의 합과 제곱근을 계산한다 
    p1_sum += dataset[p1][item];
    p2_sum += dataset[p2][item];
    p1_sq_sum += Math.pow(dataset[p1][item],2);
    p2_sq_sum += Math.pow(dataset[p2][item],2);
    prod_p1p2 += dataset[p1][item]*dataset[p2][item];
  }
  var numerator =prod_p1p2 - (p1_sum*p2_sum/num_existence); // 피어슨상관계수 결과값은 -1과 1사이에 존재해야 하며, 
  var st1 = p1_sq_sum - Math.pow(p1_sum,2)/num_existence;
  var st2 = p2_sq_sum -Math.pow(p2_sum,2)/num_existence;
  var denominator = Math.sqrt(st1*st2);
  if(denominator ==0) return 0;
  else {
    var val = numerator / denominator;
    return val;
  }
};

var len  = function(obj){ // 객체의 길이를 계산해주는 도우미 함수
  var len=0;
  for(var i in obj){
    len++;
  }
  return len;
};

/*
유사성 점수가 만들어진 후, 우리는 우리가 원하는 사용자들과 관련하여 순위를 매기는 기능을 만듭니다. 즉, 음악의 같은 취향을 가진 다른 사용자들을 찾습니다.
*/

var similar_user = function(dataset,person,num_user,distance){
  var scores=[];
  for(var others in dataset){
    if(others != person && typeof(dataset[others])!="function"){
      var val = distance(dataset,person,others);
      var p = others;
      scores.push({val:val,p:p});
    }
  }
  scores.sort(function(a,b){
    return b.val < a.val ? -1 : b.val > a.val ? 1 : b.val >= a.val ? 0 : NaN;
  });
  var score=[];
  for(var i =0;i<num_user;i++){
    score.push(scores[i]);
  }
  return score;    
};

/* 
이 기능은 사용자를 비교할 때 사용자가 자신과 비교되지 않는지 확인합니다. 
그런 다음 정렬된 결과의 사용자 수를 반환합니다.
*/
similar_user(dataset,'Kim',2,pearson_correlation); 
// (dataset, '유사성검색하고싶은 유저', '찾고싶은 유저 숫자',피어슨_상관관계 메소드')

/*
[ {val: 0.9285714285714296, p: "Park"}
  {val: -0.8660254037844387, p: "Lee"} ]
*/

var recommendation_eng = function(dataset,person,distance){
 
  var totals = {
    //세타함수의 생성을 피하게 한다.
    //생성하지 않을 경우 객체에 속성이 있는지 확인하고 값을 추가합니다.
    //세터함수때문에 기능 속성을 변환할때, 데이터집합에 만들어집니다.
      setDefault:function(props,value){
        if(!this[props]){
          this[props] =0;
        }

        this[props] += value;
      }
    },
    simsum = {
      setDefault:function(props,value){
        if(!this[props]){
          this[props] =0;
        }
    
        this[props] += value;
      }
    },
    rank_lst =[];
  for(var other in dataset){
    if(other ===person) continue;
    var similar = distance(dataset,person,other);
    
    if(similar <=0) continue;
    for(var item in dataset[other]){
      if(!(item in dataset[person]) ||(dataset[person][item]==0)){
        //세터가 결과를 보기좋게 해줍니다
        totals.setDefault(item,dataset[other][item]*similar);
        simsum.setDefault(item,similar);
      }
    }
  }
  
  for(var item in totals){
  // 세터함수가 수행하는 작업, 객체의 기능을 피할 수 있는 방법  
    if(typeof totals[item] !="function"){
           
      var val = totals[item] / simsum[item];
      rank_lst.push({val:val,items:item});
    }
  }
  rank_lst.sort(function(a,b){
    return b.val < a.val ? -1 : b.val > a.val ? 
      1 : b.val >= a.val ? 0 : NaN;
  });
  var recommend = []; 
  for(var i in rank_lst){
    recommend.push(rank_lst[i].items);
  }
  return [rank_lst,recommend];
};