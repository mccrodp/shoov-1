'use strict';

/**
 * @ngdoc service
 * @name clientApp.events
 * @description
 * # events
 * Service in the clientApp.
 */
angular.module('clientApp')
  .service('Repos', function ($q, $http, $timeout, Config, $rootScope, $log) {

    // A private cache key.
    var cache = {};

    // Update event broadcast name.
    var broadcastUpdateEventName = 'ShoovReposChange';

    this.create = function(label) {
      return $http.post(Config.backend + '/api/repositories', {label: label});
    };


    /**
     * Return the promise with the events list, from cache or the server.
     * @param string org
     *   Optional. The organization name
     * @param int repoId
     *   Optional. The repository ID.
     * @param int pageNum
     *   Optional. The page number.
     *
     * @returns {*}
     */
    this.get = function(org, repoId,  pageNum) {
      pageNum = pageNum ? pageNum : 1;
      var identifier = repoId + ':' + org + ':' + pageNum;
      if (cache && cache[identifier]) {
        return $q.when(cache[identifier].data);
      }

      return getDataFromBackend(org, repoId,  pageNum);
    };


    /**
     * Return repositories from the server.
     *
     * @param string org
     *   Optional. The organization name
     * @param int pageNum
     *   The page number.
     * @param int repoId
     *   Optional. The repository ID.
     *
     * @returns {$q.promise}
     */
    function getDataFromBackend(org, repoId,  pageNum) {
      var deferred = $q.defer();
      var url = Config.backend + '/api/github_repos';

      if (repoId) {
        url += '/' + repoId;
      }

      if (org) {
        url += '?organization=' + org;
      }

      var params = {
        sort: '-id',
        page: pageNum
      };
      $http({
        method: 'GET',
        url: url,
        params: params
      }).success(function(response) {
        var identifier = repoId + ':' + org + ':' + pageNum;
        setCache(identifier, response);
        deferred.resolve(response);
      });

      return deferred.promise;
    };

    /**
     * Save cache, and broadcast en event to inform that the data changed.
     *
     * @param int companyId
     *   The company ID.
     * @param data
     *   Object with the data to cache.
     */
    var setCache = function(cacheId, data) {
      // Cache data by company ID.
      cache[cacheId] = {
        data: data,
        timestamp: new Date()
      };

      // Clear cache in 5 seconds.
      $timeout(function() {
        if (cache.data && cache.data[cacheId]) {
          cache.data[cacheId] = null;
        }
      }, 5000);

      // Broadcast a change event.
      $rootScope.$broadcast(broadcastUpdateEventName);
    };

    $rootScope.$on('clearCache', function() {
      cache = {};
    });

  });
