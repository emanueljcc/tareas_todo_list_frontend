angular.module('appTareas', ['ui.router'])
	.config(function($stateProvider,$urlRouterProvider){
		$stateProvider
		.state('alta',{
			url: '/alta',
			templateUrl: '../views/alta.html',
			controller: 'ctrlAlta'
		})
		.state('editar',{
			url: '/editar',
			templateUrl: '../views/editar.html',
			controller: 'ctrlEditar'
		});
		$urlRouterProvider.otherwise('alta');
	})

	.factory('comun', function($http){
		var comun = {};

		comun.tareas = [];

		comun.tarea = {};

		/** SECCION DE METODOS REMOTOS **/
		comun.getAll = function(){
			return $http.get('http://localhost:3000/tareas')
			.then(function(data){
				angular.copy(data.data, comun.tareas)
				return comun.tareas;
			})
			.catch(function(err){
				console.log(err);
			})
		}


		comun.add = function(tarea){
			return $http.post('http://localhost:3000/tarea', tarea)
			.then(function(tarea){
				comun.tareas.push(tarea.data);
			})
		}

		comun.update = function(tarea){
			return $http.put('http://localhost:3000/tarea/'+tarea._id, tarea)
			.then(function(data){
				var indice = comun.tareas.indexOf(tarea);
				comun.tareas[indice] = data.data;
			})
		}

		comun.delete = function(tarea){
			return $http.delete('http://localhost:3000/tarea/'+tarea._id,tarea)
			.then(function(){
				var indice = comun.tareas.indexOf(tarea);
				comun.tareas.splice(indice, 1);
			})
		}



		return comun;
	})


/*$state es para llamar go() y poder redireccionar*/

	.controller('ctrlAlta', function($scope,$state,comun){
		$scope.tarea = {};
		//$scope.tareas = [];

		comun.getAll(); //invocar funcion

		$scope.tareas=comun.tareas;
		$scope.prioridades = ['Baja','Normal','Alta'];

		$scope.agregar = function(){
			comun.add({
				nombre: $scope.tarea.nombre,
				prioridad: parseInt($scope.tarea.prioridad) //parseint pára que lo entienda como numero
			})
			$scope.tarea.nombre = '';
			$scope.tarea.prioridad = '';
		}

		$scope.masPrioridad = function(tarea){
			tarea.prioridad += 1;
		}

		$scope.menosPrioridad = function(tarea){
			tarea.prioridad -= 1;
		}

		$scope.eliminar = function(tarea){
			comun.delete(tarea);
		}

		$scope.procesaObjeto = function(tarea){
			comun.tarea = tarea;
			$state.go('editar',tarea);

		}
	})
	.controller('ctrlEditar', function($scope,$state,comun){
		$scope.tarea = comun.tarea;

		$scope.actualizar = function(){
			comun.update($scope.tarea);
			$state.go('alta');
		}

		$scope.eliminar = function(){
			comun.delete($scope.tarea);
			$state.go('alta');
		}		
	})